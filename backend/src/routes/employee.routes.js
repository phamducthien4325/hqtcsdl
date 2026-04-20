import { Router } from "express";
import * as controller from "../controllers/employee.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const employeeRouter = Router();

employeeRouter.get("/", asyncHandler(controller.listEmployees));
