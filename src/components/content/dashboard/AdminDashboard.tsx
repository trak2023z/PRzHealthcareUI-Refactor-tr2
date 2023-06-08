import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Header from "../Header";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import "../../../App.css";

export default function AdminDashboardContent() {
  let navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            Test
        </Container>
      </Box>
      
    </Box>
  );
}
