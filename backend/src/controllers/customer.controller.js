import * as customerService from "../services/customer.service.js";

export async function listCustomers(req, res) {
  return res.json(await customerService.listCustomers(req.query));
}

export async function getCustomer(req, res) {
  return res.json(await customerService.getCustomer(req.params.customerNumber));
}

export async function createCustomer(req, res) {
  return res.status(201).json(await customerService.createCustomer(req.body));
}

export async function updateCustomer(req, res) {
  return res.json(await customerService.updateCustomer(req.params.customerNumber, req.body));
}

export async function deleteCustomer(req, res) {
  return res.json(await customerService.deleteCustomer(req.params.customerNumber));
}
