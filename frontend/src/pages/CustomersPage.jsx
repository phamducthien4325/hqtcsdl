import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { FilterToolbar } from "../components/FilterToolbar";
import { DataTable } from "../components/DataTable";
import { usePaginatedResource } from "../hooks/usePaginatedResource";

export function CustomersPage() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const { data, loading } = usePaginatedResource("/customers", {
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    search,
    country
  });

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        description="Search by name, contact, and country with server-side pagination."
      />
      <FilterToolbar>
        <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
        <TextField
          label="Country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          select
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All countries</MenuItem>
          {["France", "USA", "Germany", "Spain", "Japan", "Australia"].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </FilterToolbar>
      <DataTable
        rows={(data.items ?? []).map((item) => ({ id: item.customerNumber, ...item }))}
        columns={[
          { field: "customerNumber", headerName: "Customer #", width: 120 },
          { field: "customerName", headerName: "Customer", flex: 1.2 },
          { field: "country", headerName: "Country", width: 150 },
          { field: "phone", headerName: "Phone", width: 160 },
          {
            field: "creditLimit",
            headerName: "Credit Limit",
            width: 150,
            valueFormatter: (value) => `$${Number(value ?? 0).toLocaleString()}`
          }
        ]}
        loading={loading}
        rowCount={data.meta?.total ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  );
}
