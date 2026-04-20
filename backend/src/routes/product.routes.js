import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.middleware.js";
import { productCreateSchema, productUpdateSchema } from "../schemas/product.schema.js";
import { requireRole } from "../middleware/auth.middleware.js";

export const productRouter = Router();

productRouter.get("/", asyncHandler(controller.listProducts));
productRouter.get("/:productCode", asyncHandler(controller.getProduct));
productRouter.post("/", requireRole("admin"), validate(productCreateSchema), asyncHandler(controller.createProduct));
productRouter.put("/:productCode", requireRole("admin"), validate(productUpdateSchema), asyncHandler(controller.updateProduct));
productRouter.delete("/:productCode", requireRole("admin"), asyncHandler(controller.deleteProduct));
