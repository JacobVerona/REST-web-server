import jwt from 'jsonwebtoken'
import { prismaClient } from '../model/PrismaClient.js'
import bcrypt from 'bcrypt';
import { body } from 'express-validator'
import { logger } from '../routes/Logger.js';

const TOKEN_KEY = process.env.TOKEN_KEY;

export class AuthController {
    auth = async (req, res, next) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            logger.error("[AUTH]", "A token is required for authentication")
            return res.status(403).send("A token is required for authentication");
        }
        try {
            req.payload = jwt.verify(token, TOKEN_KEY || "NO_TOKEN");
        } catch (err) {
            logger.error("[AUTH]", "Invalid Token")
            return res.status(401).send("Invalid Token");
        }
        return next();
    }

    register = {
        validation: [
            body('name').notEmpty(),
            body('password').notEmpty(),
        ],
        handler: async (req, res) => {
            const { name, password } = req.body

            if(await prismaClient.user.count({
                where: {
                    name: name
                }
            }) > 0) {
                return res.status(409).send("User exist.");
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            let newUser = await prismaClient.user.create({
                data: {
                    name: name,
                    password: encryptedPassword,
                    token: ""
                }
            });

            const token = jwt.sign(
                { user_id: newUser.id, name },
                TOKEN_KEY || "NOTOKEN",
                {
                    expiresIn: "2h",
                }
            );

            newUser = await prismaClient.user.update({
                where: {
                    id: newUser.id
                },
                data: newUser && {
                    token: token
                },
            });
            delete newUser.password

            res.status(201).json({
                user: newUser
            });
        }
    }

    login = {
        validation: [
            body('name').notEmpty(),
            body('password').notEmpty(),
        ],
        handler: async (req, res) => {
            const { name, password } = req.body;

            const user = await prismaClient.user.findFirst({
                where: {
                    name: name
                }
            });

            if(user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id: admin.id, name },
                    TOKEN_KEY || "NOTOKEN",
                    {
                        expiresIn: "2h",
                    }
                );

                const updatedUser = await prismaClient.user.update({
                    where: {
                        id: newUser.id
                    },
                    data: newUser && {
                        token: token
                    }
                });

                res.status(200).json({
                    name: updatedUser.name,
                    token: token
                });
                return;
            }

            res.status(400).send("Invalid Credentials");
        }
    }
}

const authController = new AuthController()
export { authController }