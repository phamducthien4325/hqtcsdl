import { useEffect, useState } from "react";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { api } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";

export function ReportsPage() {
  const [report, setReport] = useState("sales");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get(`/reports/${report}`).then((response) => {
      setRows(response.data);
    });
  }, [report]);

  const download = async (format) => {
    const response = await api.get(`/reports/${report}/export`, {
      params: { format },
      responseType: "blob"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(response.data);
    link.download = `${report}.${format}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const columns = rows.length
    ? Object.keys(rows[0]).map((field) => ({
        field,
        headerName: field,
        flex: 1,
        minWidth: 140
      }))
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Exports"
        title="Reports"
        description="Preview predefined reports and export them as CSV or Excel."
      />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField label="Report" select value={report} onChange={(event) => setReport(event.target.value)} sx={{ maxWidth: 240 }}>
          <MenuItem value="sales">Sales report by month</MenuItem>
          <MenuItem value="customers">Customer report</MenuItem>
          <MenuItem value="inventory">Inventory report</MenuItem>
        </TextField>
        <Button variant="contained" startIcon={<DownloadOutlinedIcon />} onClick={() => download("csv")}>
          Export CSV
        </Button>
        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={() => download("xlsx")}>
          Export Excel
        </Button>
      </Stack>
      <DataTable
        rows={rows.map((item, index) => ({ id: index, ...item }))}
        columns={columns}
        loading={false}
        rowCount={rows.length}
        paginationModel={{ page: 0, pageSize: 25 }}
        onPaginationModelChange={() => {}}
        serverMode={false}
      />
    </>
  );
}
