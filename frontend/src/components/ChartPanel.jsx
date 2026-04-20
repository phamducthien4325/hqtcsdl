import { Box, Paper, Typography } from "@mui/material";

export function ChartPanel({ title, subtitle, actions, children, height = 320 }) {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        height,
        bgcolor: "#ffffff",
        border: "1px solid rgba(196, 197, 213, 0.16)",
        boxShadow: "0 24px 60px -32px rgba(13, 45, 126, 0.28)",
        backgroundImage:
          "radial-gradient(circle at top right, rgba(137, 245, 231, 0.18), transparent 32%), linear-gradient(180deg, rgba(255, 255, 255, 0.98), #fdfefe)"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "#757684", display: "block", letterSpacing: "0.18em" }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" sx={{ color: "#444653", maxWidth: 360 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {actions}
      </Box>
      <Box sx={{ height: "calc(100% - 64px)" }}>{children}</Box>
    </Paper>
  );
}
