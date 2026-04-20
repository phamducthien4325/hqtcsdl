import { Box, Stack, Typography } from "@mui/material";

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      spacing={2}
      sx={{ mb: 4 }}
    >
      <Box>
        <Typography variant="overline" sx={{ color: "#757684" }}>
          {eyebrow}
        </Typography>
        <Typography variant="h3" sx={{ color: "#0d2d7e", mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#444653", maxWidth: 760 }}>
          {description}
        </Typography>
      </Box>
      {actions ? <Stack direction="row" spacing={1.5}>{actions}</Stack> : null}
    </Stack>
  );
}
