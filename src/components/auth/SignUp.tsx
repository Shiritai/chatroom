import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { APP_NAME, PROJECT } from "../shared/Header";
import { RoutePages } from "../../controller/router/RoutePages";
import { EmailTextField, PasswordTextField } from "../chat/MyTextField";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../../db/firebase";
import { useSignIn } from "./Auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignProps } from "../../types/PagePropTypes";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/Shiritai/chatroom">
        {`${APP_NAME} for ${PROJECT}`}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const SignUp = (props?: SignProps) => {
  let data: FormData;

  const auth = useAuth();
  const signIn = useSignIn();
  const [isPasswordNotSame, setIsPasswordNotSame] = useState(false);
  const nav = useNavigate()

  const handleSignUp = () => {
    if (data) {
      let email = data.get("email");
      let password = data.get("password");
      let nickname = data.get("nickname");
      if (!email || !password || isPasswordNotSame || !nickname) {
        return;
      } else {
        createUserWithEmailAndPassword(
          auth,
          email.toString(),
          password.toString()
        )
          .then((cred) => {
            let nn = nickname!.toString();
            signIn.signIn(cred.user);
            alert(`Sign up ${nn} successfully`);
            updateProfile(cred.user, { displayName: nn });
            if (props) {
              props.swap()
            } else {
              nav(RoutePages.SIGN_IN.path)
            }
          })
          .catch((err) => {
            alert(`Failed to sign up: ${err.message}`);
          });
      }
    }
  };

  const handleType = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    data = new FormData(event.currentTarget);
    let local = {
      email: data.get("email"),
      password: data.get("password"),
      nickname: data.get("nickname"),
      CheckPassword: data.get("CheckPassword"),
    };
    console.log(local);
    setIsPasswordNotSame(
      (!local.password && !local.CheckPassword) ||
        (local.password &&
          local.CheckPassword &&
          local.password.toString() == local.CheckPassword.toString())
        ? false
        : true
    );
  };

  const linkHint = "Already have an account? Sign in";

  const RedirectLink = () => {
    return (
      <Link href={RoutePages.SIGN_IN.path} variant="body2">
        {linkHint}
      </Link>
    );
  };

  const SwapLink = () => {
    return (
      <Link onClick={props!.swap} variant="body2">
        {linkHint}
      </Link>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AddCircleOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onChange={handleType}
          onSubmit={(ev) => {
            handleType(ev);
            handleSignUp();
          }}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="nickname"
                required
                fullWidth
                id="nickname"
                label="Nick Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <EmailTextField {...{ focus: false }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PasswordTextField />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="CheckPassword"
                label="Check Password"
                type="password"
                id="CheckPassword"
                error={isPasswordNotSame}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSignUp}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid item>{props ? <SwapLink /> : <RedirectLink />}</Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default SignUp;
