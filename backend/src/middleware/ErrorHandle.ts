import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export function ErrorHandle(error: any, req: Request, res: Response, next: NextFunction){

    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message})
    }

    if(error instanceof ZodError){
        return res.status(400).json({
            message: "Erro na validação dos dados",
            errors: error.issues.map(e => ({
                field: e.path.join(".") || "unknown",
                message: e.message
            }))
        })
    }

    return res.status(500).json({message: error.message || "Erro interno do servidor"})

}