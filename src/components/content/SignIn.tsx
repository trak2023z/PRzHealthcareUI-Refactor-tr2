import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Copyright from "./Copyright";
import { UseAuthenticatedUser } from "../hooks/UseAuthenticatedUser";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginAccount, LoginData } from "../../api/ApiAccount";
import { loginSchema } from "../validators/accountValidator";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useState } from "react";
import prz_logo from "../../assets/prz_logo.png";
import { Stack } from "@mui/material";

export default function SignIn() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { isAuthenticated } = UseAuthenticatedUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });
  let navigate = useNavigate();

  const handleLogin = (data: LoginData) => {
    loginAccount(data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("login", res.data.login);
        localStorage.setItem("accId", res.data.accId);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("atyId", res.data.atyId.toString());
        navigate("/");
      })
      .catch((error) => {
        if (
          error.response.data.message != null &&
          error.response.data.message != ""
        ) {
          enqueueSnackbar(error.response.data.message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            variant: "error",
            autoHideDuration: 5000,
            preventDuplicate: true,
          });
        }
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${prz_logo})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Logowanie
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleLogin)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Login"
              autoComplete="login"
              autoFocus
              error={!!errors?.login}
              {...register("login")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Hasło"
              type="password"
              id="password"
              error={!!errors?.password}
              autoComplete="current-password"
              {...register("password")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Zaloguj
            </Button>
            <Stack direction={"column"} spacing={2}>
              <Stack
                direction={"row"}
                spacing={5}
                justifyContent="center"
                alignItems="center"
              >
                <Button variant="contained" color="success">
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Zarejestruj się
                  </Link>
                </Button>
              </Stack>
            </Stack>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
