
import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        message:"Internal Server Error",
        error: "Unknown error occured"
    });
}