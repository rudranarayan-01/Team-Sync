
import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandler: ErrorRequestHandler = (error, req, res, next):any => {

    console.error(`Error occurred in Path: ${req.path} - `, error);

    if(error instanceof SyntaxError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message:"Invalid JSON payload please check your request body",
            error: "Invalid JSON payload,BAD_REQUEST"
        });
    }


    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error: error?.message || "Unknown error occured"
    });
}