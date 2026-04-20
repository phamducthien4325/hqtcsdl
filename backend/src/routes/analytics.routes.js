import { Router } from "express";
import * as controller from "../controllers/analytics.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard", asyncHandler(controller.getDashboard));
analyticsRouter.get("/pivot", asyncHandler(controller.getPivot));
