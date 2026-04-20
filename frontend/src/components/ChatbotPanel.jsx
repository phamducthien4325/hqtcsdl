import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { api } from "../services/api";

const suggestedPrompts = [
  "Top 5 customers this year",
  "Total revenue in 2004",
  "Orders from France",
  "Average payment amount for customers in France"
];

export function ChatbotPanel() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  const submit = async () => {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/chatbot/query", { question });
      setResponse(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Unable to run chatbot query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          bgcolor: "#0d2d7e",
          color: "white",
          boxShadow: "0 12px 32px -4px rgba(25, 28, 30, 0.16)",
          "&:hover": { bgcolor: "#2b4696" }
        }}
      >
        <SmartToyOutlinedIcon />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 460, maxWidth: "100vw", p: 3, bgcolor: "#f7f9fb", minHeight: "100%" }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" sx={{ color: "#0d2d7e", mb: 1 }}>
                AI Chat
              </Typography>
              <Typography variant="body2" sx={{ color: "#444653" }}>
                Query the ClassicModels warehouse in natural language. The assistant will use OpenAI when available and fall back to safe built-in SQL rules.
              </Typography>
            </Box>

            <Stack spacing={1.25}>
              {suggestedPrompts.map((prompt) => (
                <Paper
                  key={prompt}
                  onClick={() => setQuestion(prompt)}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    bgcolor: "#ffffff",
                    transition: "background-color 160ms ease",
                    "&:hover": { bgcolor: "#eef1f4" }
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "rgba(13,45,126,0.08)",
                        color: "#0d2d7e",
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      <AutoAwesomeOutlinedIcon fontSize="small" />
                    </Box>
                    <Typography variant="body2">{prompt}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Typography variant="overline" sx={{ color: "#757684" }}>
              Ask a question
            </Typography>
            <TextField
              multiline
              minRows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Top 5 customers this year"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ffffff",
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendOutlinedIcon />}
              onClick={submit}
              disabled={loading}
            >
              {loading ? "Running..." : "Run query"}
            </Button>
            {error ? (
              <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "#ffdad6", color: "#93000a" }}>
                <Typography variant="body2">{error}</Typography>
              </Paper>
            ) : null}
            {response ? (
              <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: "#ffffff" }}>
                <Stack spacing={1.5}>
                  <Typography variant="overline" sx={{ color: "#757684" }}>
                    Explanation
                  </Typography>
                  <Typography variant="body2">{response.explanation}</Typography>
                  <Typography variant="overline" sx={{ color: "#757684" }}>
                    SQL
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "ui-monospace, SFMono-Regular, monospace",
                      bgcolor: "#f2f4f6",
                      p: 1.5,
                      borderRadius: 2
                    }}
                  >
                    {String(response.sql)}
                  </Typography>
                  <Typography variant="overline" sx={{ color: "#757684" }}>
                    Rows
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", maxHeight: 320, overflow: "auto" }}
                  >
                    {JSON.stringify(response.rows, null, 2)}
                  </Typography>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
