import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { api } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { ChartPanel } from "../components/ChartPanel";

const pieColors = ["#0d2d7e", "#2b4696", "#89f5e7", "#b6c4ff", "#d5e3fc", "#6bd8cb"];
const axisTick = { fill: "#626578", fontSize: 12 };
const tooltipStyle = {
  border: "1px solid rgba(196, 197, 213, 0.18)",
  borderRadius: 16,
  boxShadow: "0 20px 50px -28px rgba(25, 28, 30, 0.38)",
  background: "rgba(255, 255, 255, 0.94)",
  backdropFilter: "blur(10px)"
};

function currencyFormatter(value) {
  return `$${Number(value ?? 0).toLocaleString()}`;
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/analytics/dashboard").then((response) => setDashboard(response.data));
  }, []);

  const totalOrders =
    dashboard?.ordersPerMonth?.reduce((sum, item) => sum + item.totalOrders, 0) ?? 0;
  const topProductLine = dashboard?.revenueByProductLine?.[0];

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Analytics"
        title="Executive Overview"
        description="Real-time performance metrics and architectural data visualizations for ClassicModels database operations."
        actions={[
          <Button key="date" variant="text" startIcon={<CalendarMonthOutlinedIcon />} sx={{ color: "#444653", bgcolor: "#fff" }}>
            Last 30 Days
          </Button>,
          <Button key="export" variant="contained" startIcon={<DownloadOutlinedIcon />}>
            Export Report
          </Button>
        ]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Total Revenue"
            value={`$${Number(dashboard?.totalRevenue ?? 0).toLocaleString()}`}
            accent="#0d2d7e"
            chip={{ label: "+12.5%" }}
            note="vs. previous period"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Active Orders"
            value={totalOrders.toLocaleString()}
            accent="#2b4696"
            chip={{ label: `${dashboard?.revenueByCountry?.length ?? 0} markets`, color: "#d5e3fc" }}
            note="distributed across active countries"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            label="Tracked Customers"
            value={(dashboard?.topCustomers?.length ?? 0).toLocaleString()}
            accent="#005049"
            chip={{ label: "Top ranked", color: "#89f5e7", textColor: "#005049" }}
            note="revenue leaders by payment volume"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <ChartPanel
            title="Total Revenue Trend"
            subtitle="Monthly payment receipts with a larger reading area for year-over-year visibility."
            height={430}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard?.revenueOverTime ?? []}>
                <CartesianGrid vertical={false} stroke="rgba(196, 197, 213, 0.2)" strokeDasharray="4 8" />
                <XAxis
                  dataKey="month"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => currencyFormatter(value)}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#191c1e", fontWeight: 700, marginBottom: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d2d7e"
                  strokeWidth={4}
                  dot={{ r: 0 }}
                  activeDot={{ r: 7, fill: "#89f5e7", stroke: "#0d2d7e", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ChartPanel
            title="Top Product Line"
            subtitle={
              topProductLine
                ? `${topProductLine.productLine} is leading the revenue mix.`
                : "Share of total revenue."
            }
            height={430}
          >
            <Stack spacing={2} sx={{ height: "100%" }}>
              <Box sx={{ flex: 1, minHeight: 0, pt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 18, right: 8, bottom: 12, left: 8 }}>
                    <Pie
                      data={dashboard?.revenueByProductLine ?? []}
                      dataKey="revenue"
                      nameKey="productLine"
                      cx="50%"
                      cy="50%"
                      outerRadius="88%"
                      innerRadius="56%"
                      paddingAngle={0}
                      cornerRadius={0}
                      stroke="none"
                    >
                      {(dashboard?.revenueByProductLine ?? []).map((entry, index) => (
                        <Cell key={entry.productLine} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => currencyFormatter(value)}
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: "#191c1e", fontWeight: 700 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack
                direction="row"
                useFlexGap
                flexWrap="wrap"
                justifyContent="center"
                columnGap={1.5}
                rowGap={1}
                sx={{ px: 1, pb: 0.5 }}
              >
                {(dashboard?.revenueByProductLine ?? []).map((entry, index) => (
                  <Stack
                    key={entry.productLine}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ color: pieColors[index % pieColors.length] }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: pieColors[index % pieColors.length],
                        flexShrink: 0
                      }}
                    />
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                      {entry.productLine}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </ChartPanel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <ChartPanel
            title="Top 10 Products"
            subtitle="Ordered quantity comparison with clearer spacing between bars."
            height={420}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.topProducts ?? []}>
                <CartesianGrid vertical={false} stroke="rgba(196, 197, 213, 0.2)" strokeDasharray="4 8" />
                <XAxis dataKey="productName" hide />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={52} />
                <Tooltip
                  formatter={(value) => Number(value).toLocaleString()}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#191c1e", fontWeight: 700 }}
                />
                <Bar dataKey="totalQuantity" fill="#2b4696" radius={[10, 10, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid rgba(196, 197, 213, 0.16)",
              boxShadow: "0 24px 60px -32px rgba(13, 45, 126, 0.22)",
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,248,252,0.98))"
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "#757684", display: "block", mb: 2, letterSpacing: "0.18em" }}
            >
              Top customers by revenue
            </Typography>
            <Stack spacing={1.75}>
              {(dashboard?.topCustomers ?? []).map((customer, index) => (
                <Stack
                  key={customer.customerNumber}
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    bgcolor: "rgba(242, 244, 246, 0.88)",
                    border: "1px solid rgba(196, 197, 213, 0.14)"
                  }}
                >
                  <Typography fontWeight={600}>{`${index + 1}. ${customer.customerName}`}</Typography>
                  <Typography fontWeight={700}>
                    ${Number(customer.revenue).toLocaleString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Typography
              variant="overline"
              sx={{ color: "#757684", display: "block", mt: 4, mb: 2, letterSpacing: "0.18em" }}
            >
              Revenue by country
            </Typography>
            <Stack spacing={1.75}>
              {(dashboard?.revenueByCountry ?? []).slice(0, 5).map((row) => (
                <Stack key={row.country} direction="row" alignItems="center" spacing={2}>
                  <Typography sx={{ width: 110, fontWeight: 700 }}>{row.country}</Typography>
                  <Paper
                    sx={{
                      flex: 1,
                      bgcolor: "#eef1f4",
                      border: "none",
                      height: 12,
                      borderRadius: 99,
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.max((row.revenue / (dashboard.revenueByCountry?.[0]?.revenue ?? 1)) * 100, 6)}%`,
                        borderRadius: 99,
                        background: "linear-gradient(135deg, #0d2d7e 0%, #2b4696 100%)"
                      }}
                    />
                  </Paper>
                  <Typography sx={{ minWidth: 116, textAlign: "right", color: "#444653" }}>
                    ${Number(row.revenue).toLocaleString()}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
