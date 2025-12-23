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
import path from "path";
import fs from "fs";

const app = express();

// --- CRITICAL FIX FOR RENDER DEPLOYMENT ---
// This allows Express to trust the Render proxy and send secure cookies
app.set("trust proxy", 1); 

const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session block updated for Cross-Site support
const isProd = config.NODE_ENV === "production";

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: isProd,               // true in production
        httpOnly: true,
        sameSite: isProd ? "none" : "lax", // Must be "none" if frontend/backend URLs differ
    })
);

app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
    "https://teamsync-frontend-605k.onrender.com",
    config.FRONTEND_ORIGIN?.replace(/\/+$/, ""),
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Required to accept cookies from frontend
    })
);

app.get('/', asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
        message: "API is running"
    });
}));

// Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

// Serve frontend in production (Only if you are deploying as a Monolith)
const publicDist = path.join(__dirname, "../public");
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
