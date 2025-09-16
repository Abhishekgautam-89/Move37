// const prisma = require ("../prisma/prismaClient");
import prisma from "../prisma/prismaClient.js";

import { io }  from "../sockets.js";

let successStatus = 200
let errorStatus = 500
let castVote = async (req, res) => {
  try {
    const { optionId } = req.body;
    const userId = req.id

    const poll = await prisma.pollOption.findUnique({
      where:{id:parseInt(optionId)},
      include:{poll:{
        include: {options:true}
      }
      }
    })
     const checkPreviousPoll = await prisma.vote.findMany({
      where:{
        userId,
        optionId: {
          in: poll.poll.options.map((p)=>p.id)
        }
      }
    })
    // console.log(checkPreviousPoll, "checkPreviousPoll>>")
    if (checkPreviousPoll.length>0){
      errorStatus=403
      throw 'Already voted for this poll'
     
    }
    else{
    const vote = await prisma.vote.create({
      data: { userId,optionId: parseInt(optionId) }
    });
  }
    // Fetch updated poll results
    const option = await prisma.pollOption.findUnique({
      where: { id: parseInt(optionId) },
      include: {
        poll: {
          include: {
            options: { include: { votes: true } }
          }
        }
      }
    });

    const pollResults = option.poll.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      voteCount: opt.votes.length
    }));

    // Broadcast live update
    io.to(`poll-${option.pollId}`).emit("pollUpdate", pollResults);

    return res.status(successStatus).json({pollResults ,success:true});
  } catch (err) {
    console.log(err)
    return res.status(errorStatus).json({ error: err, success:false });
  }
};
export default castVote 
