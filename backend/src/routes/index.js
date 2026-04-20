import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { customerRouter } from "./customer.routes.js";
import { orderRouter } from "./order.routes.js";
import { productRouter } from "./product.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { employeeRouter } from "./employee.routes.js";
import { analyticsRouter } from "./analytics.routes.js";
import { reportRouter } from "./report.routes.js";
import { chatbotRouter } from "./chatbot.routes.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use(requireAuth);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/employees", employeeRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/chatbot", chatbotRouter);
