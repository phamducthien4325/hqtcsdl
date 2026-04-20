import * as orderService from "../services/order.service.js";

export async function listOrders(req, res) {
  return res.json(await orderService.listOrders(req.query));
}

export async function getOrder(req, res) {
  return res.json(await orderService.getOrder(req.params.orderNumber));
}

export async function createOrder(req, res) {
  return res.status(201).json(await orderService.createOrder(req.body));
}

export async function updateOrder(req, res) {
  return res.json(await orderService.updateOrder(req.params.orderNumber, req.body));
}

export async function deleteOrder(req, res) {
  return res.json(await orderService.deleteOrder(req.params.orderNumber));
}
