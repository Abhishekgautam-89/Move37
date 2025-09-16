import jwt from'jsonwebtoken'
import prisma from'../prisma/prismaClient.js'

let errorStatus = 500
let auth = async (req, res, next) => {
    try {
        var accessToken = req.cookies["token"];
        if (!accessToken) {
            throw 'Please login'
        }
        var decode = jwt.verify(accessToken, process.env.SECRETKEY);
        // console.log(decode)
        var find_user = await prisma.user.findUnique({where:{ email: decode.email} });
        if (!find_user) {

            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "Lax",
                secure: true,
                domain: process.env.DOMAIN,
            });
            throw 'Un-authorized access'
        }
        if (find_user) {
            req.id = find_user.id;
            next();
        }
    }
    catch (err) {
        console.log(err)
        return res.status(errorStatus).json({message:err.message, success:false})
    }
};
export default  auth 