import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { FilterToolbar } from "../components/FilterToolbar";
import { DataTable } from "../components/DataTable";
import { usePaginatedResource } from "../hooks/usePaginatedResource";

export function OrdersPage() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, loading } = usePaginatedResource("/orders", {
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    status,
    dateFrom,
    dateTo
  });

  return (
    <>
      <PageHeader
        eyebrow="Sales Ops"
        title="Orders"
        description="Filter sales orders by date and status."
      />
      <FilterToolbar>
        <TextField label="From" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="To" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Status" select value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">All statuses</MenuItem>
          {["Shipped", "In Process", "Cancelled", "Resolved", "On Hold", "Disputed"].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </FilterToolbar>
      <DataTable
        rows={(data.items ?? []).map((item) => ({ id: item.orderNumber, ...item }))}
        columns={[
          { field: "orderNumber", headerName: "Order #", width: 120 },
          { field: "orderDate", headerName: "Order Date", width: 140 },
          { field: "status", headerName: "Status", width: 140 },
          { field: "customerName", headerName: "Customer", flex: 1, valueGetter: (_, row) => row.customer?.customerName },
          { field: "country", headerName: "Country", width: 140, valueGetter: (_, row) => row.customer?.country }
        ]}
        loading={loading}
        rowCount={data.meta?.total ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  );
}
