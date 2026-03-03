import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError"

type TokenPayloud = {
    role: string,
    sub: string
}

export function authenticated(req: Request, res: Response, next: NextFunction) {

    try {

        const secret = process.env.SECRET_KEY

        const authHeader = req.body.headers

        if (!authHeader) {
            throw new AppError("JWT token not found", 401)
        }

        const token = authHeader.split(" ")[1]

        const { role, sub: user_id } = jwt.verify(token, secret!) as TokenPayloud

        req.user = {
            id: user_id,
            role
        }

        return next()

    } catch (error) {

        throw new AppError("JWT token invalid", 401)

    }
}

