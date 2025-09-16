import prisma from '../prisma/prismaClient.js'
// const prisma = require("../prisma/prismaClient");

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

let successStatus = 200
let errorStatus = 500

export default {
    addUser: async (req, res, next) => {
        try {
            const { name, email, password } = req.body
            console.log(req.body)
            let saltRounds = parseInt(process.env.SALTROUND)
            const salt = bcrypt.genSaltSync(saltRounds);
            const passwordHash = bcrypt.hashSync(password, salt)
            const findUser = await prisma.user.findUnique({
                where:{email}
            })
            if (findUser){
                throw 'Email already registered'
            }
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash
                }
            })
            return res.status(successStatus).json({ success: true, message: 'Sucessful registeration' });
        }
        catch (err) {
            console.log(err)
            return res.status(errorStatus).json({ message: err, success: false })
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const findUser = await prisma.user.findUnique({
                where: { email }
            })
            if (!findUser) {
                errorStatus = 404;
                throw 'No-user found';
            }
            const compare = bcrypt.compareSync(password, findUser.passwordHash)
            if (!compare) {
                errorStatus = 401
                throw 'Paswword mismatch';
            }
            const payload = { email: findUser.email };
            const options = {
                expiresIn: process.env.APITOKENEXPIRY,
                issuer: "Test",
            };
            const secret = process.env.SECRETKEY;
            const token = await jwt.sign(payload, secret, options)

            res.cookie("token", token, {
                path: "/",
                maxAge: 2592000000,
                httpOnly: true,
                sameSite: "Lax",
                secure: true,
                domain: process.env.DOMAIN,
            });
            return res.status(successStatus).json({
                success: true,
                message: 'Successfully logged in',
                data: {
                    name: findUser.name,
                    email: findUser.email,
                    token: token,
                },
            });
        }
        catch (err) {
            console.log(err)
            return res.status(errorStatus).json({ message: err, success: false })

        }
    },
    logout: async (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "Lax",
            secure: true,
            domain: process.env.DOMAIN,
        });

        return res.status(global.CONFIGS.responseCode.success).json({
            success: true,
            message: global.CONFIGS.api.logoutuser,
        })
    }
}

