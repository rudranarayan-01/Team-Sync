
import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { format } from "path";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation Failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next):any => {

    console.error(`Error occurred in Path: ${req.path} - `, error);

    if(error instanceof SyntaxError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message:"Invalid JSON payload please check your request body",
            error: "Invalid JSON payload,BAD_REQUEST"
        });
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

    if (error instanceof AppError){
        return res.status(error.statusCode).json({
            message: error.message,
            error: error.errorCode || "AppError"
        });
    }


    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error: error?.message || "Unknown error occured"
    });
}