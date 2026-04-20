import { Router } from "express";
import * as controller from "../controllers/order.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.middleware.js";
import { orderCreateSchema, orderUpdateSchema } from "../schemas/order.schema.js";
import { requireRole } from "../middleware/auth.middleware.js";

export const orderRouter = Router();

orderRouter.get("/", asyncHandler(controller.listOrders));
orderRouter.get("/:orderNumber", asyncHandler(controller.getOrder));
orderRouter.post("/", requireRole("admin", "staff"), validate(orderCreateSchema), asyncHandler(controller.createOrder));
orderRouter.put("/:orderNumber", requireRole("admin", "staff"), validate(orderUpdateSchema), asyncHandler(controller.updateOrder));
orderRouter.delete("/:orderNumber", requireRole("admin"), asyncHandler(controller.deleteOrder));
