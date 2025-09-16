// const prisma = require("../prisma/prismaClssient");
import prisma from'../prisma/prismaClient.js'


let successStatus = 200
let errorStatus = 500
export default  {
    createPoll: async (req, res) => {
        try {
            const { question, options } = req.body;
            console.log(options)
            const creatorId = req.id
            const poll = await prisma.poll.create({
                data: {
                    question,
                    creatorId,
                    options: {
                        create: options.map(text => ({ text }))
                    }
                },
                include: { options: true }
            });

           return res.status(successStatus).json({poll, success:true});
        } catch (err) {
            console.log(err)
           return res.status(errorStatus).json({ error: err.message, success:false });
        }
    },

    getPoll: async (req, res) => {
        try {
            const poll = await prisma.poll.findMany({
                // where: { id: Number(req.params.id) },
                include: {
                    options: {
                        include: {
                            votes: true
                        }
                    }
                }
            });

            if (!poll) return res.status(errorStatus).json({ error: "Poll not found" });           

            return res.status(successStatus).json({poll, success:true});
        } catch (err) {
            res.status(errorStatus).json({ error: err.message, success:false });
        }
    },
    getSinglePoll:async (req, res) => {
        try {
            const poll = await prisma.poll.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    options: {
                        include: {
                            votes: true
                        }
                    }
                }
            });

            if (!poll) return res.status(errorStatus).json({ error: "Poll not found" });

            // Count votes per option
            const result = {
                ...poll,
                options: poll.options.map(opt => ({
                    ...opt,
                    voteCount: opt.votes.length
                }))
            };

            return res.status(successStatus).json({result, success:true});
        } catch (err) {
            res.status(errorStatus).json({ error: err.message, success:false });
        }
    },
}
