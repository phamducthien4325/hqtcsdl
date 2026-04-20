import { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ColorModeContext = createContext(null);

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((current) => (current === "light" ? "dark" : "light"))
    }),
    [mode]
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function useAppTheme() {
  const { mode } = useColorMode();

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0d2d7e" },
          secondary: { main: "#515f74" },
          success: { main: "#005049" },
          warning: { main: "#b26b00" },
          background: {
            default: "#f7f9fb",
            paper: "#ffffff"
          }
        },
        shape: {
          borderRadius: 8
        },
        typography: {
          fontFamily: '"Inter", sans-serif',
          h1: { fontWeight: 900, letterSpacing: "-0.04em" },
          h2: { fontWeight: 900, letterSpacing: "-0.04em" },
          h3: { fontWeight: 800, letterSpacing: "-0.03em" },
          h4: { fontWeight: 800, letterSpacing: "-0.03em" },
          h5: { fontWeight: 800, letterSpacing: "-0.02em" },
          h6: { fontWeight: 700, letterSpacing: "-0.02em" },
          overline: {
            fontWeight: 800,
            fontSize: "0.625rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase"
          },
          body2: {
            fontSize: "0.875rem"
          }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#f7f9fb"
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                border: "1px solid rgba(196, 197, 213, 0.15)",
                overflow: "visible"
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                fontWeight: 700,
                textTransform: "none"
              },
              containedPrimary: {
                background: "linear-gradient(135deg, #0d2d7e 0%, #2b4696 100%)"
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                border: "none"
              }
            }
          }
        }
      }),
    [mode]
  );
}

export { ThemeProvider };
