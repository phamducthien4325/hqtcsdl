import { Paper, Stack } from "@mui/material";

export function FilterToolbar({ children }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: "#ffffff" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {children}
      </Stack>
    </Paper>
  );
}
