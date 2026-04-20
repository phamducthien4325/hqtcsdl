import * as employeeService from "../services/employee.service.js";

export async function listEmployees(req, res) {
  return res.json(await employeeService.listEmployees());
}
