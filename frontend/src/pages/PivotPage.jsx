import { useEffect, useState } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { api } from "../services/api";
import { PageHeader } from "../components/PageHeader";

export function PivotPage() {
  const [rows, setRows] = useState([]);
  const [pivotState, setPivotState] = useState({
    rows: ["country"],
    cols: ["productLine"],
    vals: ["amount"],
    aggregatorName: "Sum"
  });

  useEffect(() => {
    api.get("/analytics/pivot").then((response) => setRows(response.data));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Analytics Report"
        description="Pivot, aggregate, and reorganize the warehouse using customer, country, product line, order number, and date dimensions."
        actions={[
          <Button
            key="refresh"
            variant="contained"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => api.get("/analytics/pivot").then((response) => setRows(response.data))}
          >
            Update Data
          </Button>
        ]}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: "#f2f4f6", flex: 1 }}>
          <Typography variant="overline" sx={{ color: "#757684" }}>
            Aggregation
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {pivotState.aggregatorName} of {pivotState.vals?.join(", ") || "amount"}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: "#f2f4f6", flex: 1 }}>
          <Typography variant="overline" sx={{ color: "#757684" }}>
            Layout
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Rows: {pivotState.rows?.join(", ") || "none"} | Cols: {pivotState.cols?.join(", ") || "none"}
          </Typography>
        </Paper>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 3, overflow: "visible", bgcolor: "#ffffff" }}>
        <PivotTableUI data={rows} onChange={setPivotState} {...pivotState} />
      </Paper>
    </>
  );
}
