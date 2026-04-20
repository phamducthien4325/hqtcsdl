import { Router } from "express";
import * as controller from "../controllers/report.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const reportRouter = Router();

reportRouter.get("/:type", asyncHandler(controller.getReportPreview));
reportRouter.get("/:type/export", asyncHandler(controller.exportReport));
