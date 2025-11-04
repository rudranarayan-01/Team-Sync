
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next):any => {

    console.error(`Error occurred in Path: ${req.path} - `, error);

    if(error instanceof SyntaxError){
        return res.status(400).json({
            message:"Invalid JSON payload please check your request body",
            error: "Invalid JSON payload,BAD_REQUEST"
        });
    }


    res.status(500).json({
        message:"Internal Server Error",
        error: error?.message || "Unknown error occured"
    });
}