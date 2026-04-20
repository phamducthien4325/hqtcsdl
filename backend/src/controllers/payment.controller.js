import * as paymentService from "../services/payment.service.js";

export async function listPayments(req, res) {
  return res.json(await paymentService.listPayments(req.query));
}
