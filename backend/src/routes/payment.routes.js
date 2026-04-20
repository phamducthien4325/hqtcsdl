import { Router } from "express";
import * as controller from "../controllers/payment.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const paymentRouter = Router();

paymentRouter.get("/", asyncHandler(controller.listPayments));
