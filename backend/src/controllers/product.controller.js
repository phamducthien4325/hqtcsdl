import * as productService from "../services/product.service.js";

export async function listProducts(req, res) {
  return res.json(await productService.listProducts(req.query));
}

export async function getProduct(req, res) {
  return res.json(await productService.getProduct(req.params.productCode));
}

export async function createProduct(req, res) {
  return res.status(201).json(await productService.createProduct(req.body));
}

export async function updateProduct(req, res) {
  return res.json(await productService.updateProduct(req.params.productCode, req.body));
}

export async function deleteProduct(req, res) {
  return res.json(await productService.deleteProduct(req.params.productCode));
}
