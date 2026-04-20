import * as authService from "../services/auth.service.js";

export async function login(req, res) {
  const result = await authService.login(req.body);
  return res.json(result);
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
