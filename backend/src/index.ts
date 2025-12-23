import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config"
import connectDatabse from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asynchandler.middleware";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();

// 1. MANDATORY FOR RENDER: Trust the proxy to allow secure cookies
app.set("trust proxy", 1); 

const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Optimized Session Block
// NOTE: Make sure to change NODE_ENV to "production" in Render dashboard!
const isProd = config.NODE_ENV === "production";

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000, 
        secure: isProd,               // Must be true for HTTPS
        httpOnly: true,
        sameSite: isProd ? "none" : "lax", // "none" allows cross-site cookies
    })
);

app.use(passport.initialize());
app.use(passport.session());

// 3. Robust CORS Configuration
const allowedOrigins = [
    "https://teamsync-frontend-605k.onrender.com",
    config.FRONTEND_ORIGIN?.replace(/\/+$/, ""),
    "http://localhost:3000",
    "http://localhost:5173"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true, // Crucial for session cookies
    })
);

// Routes
app.get('/', (req, res) => res.status(HTTPSTATUS.OK).json({ message: "API is running" }));

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
    console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode.`);
    await connectDatabse();
});
