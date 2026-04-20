import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { api } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";

export function PaymentsPage() {
  const [payload, setPayload] = useState({ items: [], meta: { total: 0 }, summary: {} });

  useEffect(() => {
    api.get("/payments", { params: { page: 1, pageSize: 25 } }).then((response) => setPayload(response.data));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Payment ledger with aggregate totals and averages."
      />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <StatCard
            label="Total paid"
            value={`$${Number(payload.summary.totalAmount ?? 0).toLocaleString()}`}
            accent="#0a4d8c"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            label="Average payment"
            value={`$${Number(payload.summary.averageAmount ?? 0).toLocaleString()}`}
            accent="#d6632c"
          />
        </Grid>
      </Grid>
      <DataTable
        rows={(payload.items ?? []).map((item, index) => ({ id: `${item.customerNumber}-${item.checkNumber}-${index}`, ...item }))}
        columns={[
          { field: "checkNumber", headerName: "Check #", width: 180 },
          { field: "paymentDate", headerName: "Date", width: 140 },
          { field: "customerName", headerName: "Customer", flex: 1, valueGetter: (_, row) => row.customer?.customerName },
          { field: "country", headerName: "Country", width: 140, valueGetter: (_, row) => row.customer?.country },
          { field: "amount", headerName: "Amount", width: 140, valueFormatter: (value) => `$${Number(value).toLocaleString()}` }
        ]}
        loading={false}
        rowCount={payload.meta.total ?? 0}
        paginationModel={{ page: 0, pageSize: 25 }}
        onPaginationModelChange={() => {}}
        serverMode={false}
      />
    </>
  );
}
