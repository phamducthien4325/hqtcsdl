import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
