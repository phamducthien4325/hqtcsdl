import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export function DataTable({
  rows,
  columns,
  loading,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  serverMode = true
}) {
  return (
    <Paper sx={{ borderRadius: 3, p: 0, bgcolor: "#ffffff" }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        pagination
        paginationMode={serverMode ? "server" : "client"}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          borderRadius: 3,
          "--DataGrid-containerBackground": "#ffffff",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(242, 244, 246, 0.6)",
            borderBottom: "none"
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#757684"
          },
          "& .MuiDataGrid-main": {
            borderRadius: 3
          },
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid rgba(196, 197, 213, 0.08)"
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f2f4f6"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none"
          },
          "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
            outline: "none"
          }
        }}
      />
    </Paper>
  );
}
