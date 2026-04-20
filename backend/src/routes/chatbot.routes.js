import { Router } from "express";
import * as controller from "../controllers/chatbot.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.middleware.js";
import { chatbotSchema } from "../schemas/chatbot.schema.js";

export const chatbotRouter = Router();

chatbotRouter.post("/query", validate(chatbotSchema), asyncHandler(controller.queryChatbot));
