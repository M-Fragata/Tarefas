import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";


export function authorizated(role: string[]) {

    return (req: Request, res: Response, next: NextFunction) => {

        const verifyUserRole = req.user?.role

        if (!verifyUserRole) {
            throw new AppError("User must be authenticated", 401)
        }

        if (!role.includes(verifyUserRole)) {
            throw new AppError("User Not Authorized", 403)
        }


        next()

    }

}