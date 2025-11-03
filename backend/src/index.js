import "dotenv/config";
import express,{NextFunction,Request,Response} from "express";
import cors from "cors";
import session from "cookie-session";
import {config} from "./config/app.config"

const app = express();
const BASE_PATH = config.BASE_PATH

app.use(express.json());

