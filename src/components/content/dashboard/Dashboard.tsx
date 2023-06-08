import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Header from "../Header";
import { useNavigate } from "react-router";
import AdminDashboardContent from "./AdminDashboard";

export default function Dashboard() {
  let navigate = useNavigate();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <AdminDashboardContent/>
      </Box>
    </Box>
  );
}
