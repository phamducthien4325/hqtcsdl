import * as analyticsService from "../services/analytics.service.js";

export async function getDashboard(req, res) {
  return res.json(await analyticsService.getDashboardAnalytics());
}

export async function getPivot(req, res) {
  return res.json(await analyticsService.getPivotData());
}
