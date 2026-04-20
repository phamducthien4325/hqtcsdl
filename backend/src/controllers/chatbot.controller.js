import * as chatbotService from "../services/chatbot.service.js";

export async function queryChatbot(req, res) {
  return res.json(await chatbotService.runChatbotQuery(req.body.question));
}
