import { z } from "zod";

export const chatbotSchema = z.object({
  question: z.string().min(3)
});
