import { ApiError } from "../utils/api-error.js";
import * as reportService from "../services/report.service.js";

export async function exportReport(req, res) {
  const format = req.query.format === "xlsx" ? "xlsx" : "csv";
  const payload = await reportService.exportReport(req.params.type, format);
  if (!payload) {
    throw new ApiError(404, "Report not found");
  }

  res.setHeader("Content-Type", payload.contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.params.type}-report.${payload.extension}`
  );
  return res.send(payload.buffer);
}

export async function getReportPreview(req, res) {
  const rows = await reportService.getReportPayload(req.params.type);
  if (!rows) {
    throw new ApiError(404, "Report not found");
  }
  return res.json(rows);
}
