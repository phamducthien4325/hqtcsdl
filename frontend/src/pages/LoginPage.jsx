import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "admin@classicmodels.local",
    password: "Admin123!"
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background:
          "radial-gradient(circle at top left, rgba(214,99,44,0.28), transparent 30%), radial-gradient(circle at bottom right, rgba(10,77,140,0.28), transparent 30%)"
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 460, p: 4, borderRadius: 4 }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <Typography variant="overline" color="secondary.main">
            ClassicModels Analytics Suite
          </Typography>
          <Typography variant="h3">Sign in</Typography>
          <Typography variant="body2" color="text.secondary">
            Use the seeded admin or staff account from `.env`.
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
