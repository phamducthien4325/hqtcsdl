import { useEffect, useState } from "react";
import { api } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";

export function EmployeesPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/employees").then((response) => setRows(response.data));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Org"
        title="Employees hierarchy"
        description="Reporting structure, offices, and direct reports."
      />
      <DataTable
        rows={rows.map((item) => ({ id: item.employeeNumber, ...item }))}
        columns={[
          { field: "employeeNumber", headerName: "Employee #", width: 120 },
          { field: "fullName", headerName: "Name", flex: 1, valueGetter: (_, row) => `${row.firstName} ${row.lastName}` },
          { field: "jobTitle", headerName: "Title", width: 180 },
          { field: "office", headerName: "Office", width: 160, valueGetter: (_, row) => `${row.office?.city}, ${row.office?.country}` },
          { field: "reportsTo", headerName: "Manager", flex: 1, valueGetter: (_, row) => row.manager ? `${row.manager.firstName} ${row.manager.lastName}` : "Executive" },
          { field: "teamSize", headerName: "Direct Reports", width: 140, valueGetter: (_, row) => row.subordinates?.length ?? 0 }
        ]}
        loading={false}
        rowCount={rows.length}
        paginationModel={{ page: 0, pageSize: 25 }}
        onPaginationModelChange={() => {}}
        serverMode={false}
      />
    </>
  );
}
