import { Box, Paper, Stack, Typography } from "@mui/material";

export function StatCard({ label, value, accent, note, chip }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        position: "relative",
        backgroundColor: "#ffffff",
        minHeight: 164,
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: -32,
          right: -24,
          width: 108,
          height: 108,
          borderRadius: "999px",
          background: `${accent}12`
        }
      }}
    >
      <Stack spacing={1.25} sx={{ position: "relative", zIndex: 1 }}>
        <Typography variant="overline" sx={{ color: "#444653" }}>
          {label}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          <Typography variant="h4" sx={{ color: "#191c1e" }}>
            {value}
          </Typography>
          {chip ? (
            <Box
              sx={{
                px: 1,
                py: 0.35,
                borderRadius: 10,
                bgcolor: chip.color ?? "#dce1ff",
                color: chip.textColor ?? "#264191",
                fontSize: 11,
                fontWeight: 800
              }}
            >
              {chip.label}
            </Box>
          ) : null}
        </Stack>
        {note ? (
          <Typography variant="caption" sx={{ color: "#757684" }}>
            {note}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
