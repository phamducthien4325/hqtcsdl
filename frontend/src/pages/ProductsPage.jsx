import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { FilterToolbar } from "../components/FilterToolbar";
import { DataTable } from "../components/DataTable";
import { usePaginatedResource } from "../hooks/usePaginatedResource";

export function ProductsPage() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [productLine, setProductLine] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, loading } = usePaginatedResource("/products", {
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    search,
    productLine,
    minPrice,
    maxPrice
  });

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Search products, narrow by line, and filter by price range."
      />
      <FilterToolbar>
        <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
        <TextField label="Product line" value={productLine} onChange={(event) => setProductLine(event.target.value)} select sx={{ minWidth: 200 }}>
          <MenuItem value="">All lines</MenuItem>
          {["Classic Cars", "Motorcycles", "Planes", "Ships", "Trains", "Trucks and Buses", "Vintage Cars"].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <TextField label="Min price" type="number" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        <TextField label="Max price" type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
      </FilterToolbar>
      <DataTable
        rows={(data.items ?? []).map((item) => ({ id: item.productCode, ...item }))}
        columns={[
          { field: "productCode", headerName: "Code", width: 120 },
          { field: "productName", headerName: "Product", flex: 1.2 },
          { field: "productLine", headerName: "Line", width: 170 },
          { field: "quantityInStock", headerName: "Stock", width: 120 },
          {
            field: "buyPrice",
            headerName: "Buy Price",
            width: 130,
            valueFormatter: (value) => `$${Number(value).toFixed(2)}`
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
