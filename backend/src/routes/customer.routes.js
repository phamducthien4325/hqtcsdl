import { Router } from "express";
import * as controller from "../controllers/customer.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.middleware.js";
import { customerCreateSchema, customerUpdateSchema } from "../schemas/customer.schema.js";
import { requireRole } from "../middleware/auth.middleware.js";

export const customerRouter = Router();

customerRouter.get("/", asyncHandler(controller.listCustomers));
customerRouter.get("/:customerNumber", asyncHandler(controller.getCustomer));
customerRouter.post("/", requireRole("admin"), validate(customerCreateSchema), asyncHandler(controller.createCustomer));
customerRouter.put("/:customerNumber", requireRole("admin"), validate(customerUpdateSchema), asyncHandler(controller.updateCustomer));
customerRouter.delete("/:customerNumber", requireRole("admin"), asyncHandler(controller.deleteCustomer));
