import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PivotTableChartOutlinedIcon from "@mui/icons-material/PivotTableChartOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { ChatbotPanel } from "./ChatbotPanel";

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: "Reports", path: "/reports", icon: <AnalyticsOutlinedIcon fontSize="small" /> },
  { label: "Customers", path: "/customers", icon: <TableChartOutlinedIcon fontSize="small" /> },
  { label: "Orders", path: "/orders", icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: "Products", path: "/products", icon: <Inventory2OutlinedIcon fontSize="small" /> },
  { label: "Payments", path: "/payments", icon: <PaymentsOutlinedIcon fontSize="small" /> },
  { label: "Employees", path: "/employees", icon: <BadgeOutlinedIcon fontSize="small" /> },
  { label: "Pivot Lab", path: "/pivot", icon: <PivotTableChartOutlinedIcon fontSize="small" /> }
];

export function AppLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isDesktop = useMediaQuery("(min-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <Stack spacing={3} sx={{ height: "100%", py: 3 }}>
      <Box sx={{ px: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: "#191c1e" }}>
          ClassicModels
        </Typography>
        <Typography variant="overline" sx={{ color: "#757684" }}>
          Enterprise Intelligence
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 0 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            selected={pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 0.5,
              px: 3,
              py: 1.6,
              borderRadius: 0,
              gap: 1.5,
              color: "#757684",
              "&.Mui-selected": {
                color: "#0d2d7e",
                backgroundColor: "#ffffff",
                borderLeft: "4px solid #0d2d7e",
                transform: "translateX(4px)"
              },
              "& .MuiListItemText-primary": {
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase"
              }
            }}
          >
            {item.icon}
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Stack spacing={1.25} sx={{ mx: 2, p: 2, borderRadius: 3, bgcolor: "#ffffff" }}>
        <Typography variant="overline" sx={{ color: "#757684" }}>
          System Status
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 8, height: 8, borderRadius: "999px", bgcolor: "#6bd8cb" }} />
          <Typography variant="body2" sx={{ color: "#444653" }}>
            AI processing active
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: "#757684" }}>
          Signed in as {user?.name} ({user?.role})
        </Typography>
        <Button
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ alignSelf: "flex-start", color: "#0d2d7e", px: 0 }}
        >
          Logout
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9fb" }}>
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop ? true : mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            backgroundColor: "#f2f4f6"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          color="transparent"
          elevation={0}
          sx={{
            backgroundColor: "rgba(247, 249, 251, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(196, 197, 213, 0.08)"
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
            {!isDesktop ? (
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <span />
            )}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ flexGrow: 1, justifyContent: "space-between" }}
            >
              <TextField
                size="small"
                placeholder="Search database records..."
                InputProps={{
                  startAdornment: <SearchOutlinedIcon sx={{ color: "#757684", mr: 1, fontSize: 20 }} />
                }}
                sx={{
                  width: { xs: "100%", md: 340 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    borderRadius: 2,
                    "& fieldset": { borderColor: "rgba(196, 197, 213, 0.2)" }
                  }
                }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton sx={{ color: "#757684" }}>
                  <NotificationsOutlinedIcon />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={<SmartToyOutlinedIcon />}
                  onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  AI Chat
                </Button>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          <Outlet />
        </Box>
      </Box>

      <ChatbotPanel />
    </Box>
  );
}
