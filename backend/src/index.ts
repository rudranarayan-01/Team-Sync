import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config"
import connectDatabse from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asynchandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

// Setting for deployment on serverless platforms
// import serverless from "serverless-http";


const app = express();
const BASE_PATH = config.BASE_PATH

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// session block 
const isProd = config.NODE_ENV === "production";
app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: isProd,             // must be true in production (HTTPS)
        httpOnly: true,
        sameSite: isProd ? "none" : "lax", // none for cross-site cookies in prod
    })
);


app.use(passport.initialize());
app.use(passport.session());
const allowedOrigins = [
    "https://team-sync-gamma.vercel.app",
    // make sure config.FRONTEND_ORIGIN has no trailing slash
    config.FRONTEND_ORIGIN?.replace(/\/+$/, ""),
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow Postman, server-to-server
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(null, false);
        },
        credentials: true,
    })
);



app.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new BadRequestException("Test Error Handling Middleware",ErrorCodeEnum.AUTH_INVALID_TOKEN);
    return res.status(HTTPSTATUS.OK).json({
        message: "API is running"
    });
})
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);



app.use(errorHandler);

// Serve frontend in production (do this BEFORE app.listen)
import path from "path";
import fs from "fs";

const publicDist = path.join(__dirname, "../public"); // where you copied frontend build
if (fs.existsSync(publicDist)) {
    app.use(express.static(publicDist));
    app.get("*", (req, res) => {
        res.sendFile(path.join(publicDist, "index.html"));
    });
}



app.listen(config.PORT, async () => {
    console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    await connectDatabse();
});

