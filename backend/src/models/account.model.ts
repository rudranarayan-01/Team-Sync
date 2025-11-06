import mongoose, {Document, Schema} from "mongoose";

export interface IAccount extends Document {
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}