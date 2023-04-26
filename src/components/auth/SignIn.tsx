import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { APP_NAME, PROJECT } from "../shared/Header";
import { EmailTextField, PasswordTextField } from "../chat/MyTextField";
import Grid from "@mui/material/Grid";
import { RoutePages } from "../../controller/router/RoutePages";
import { useAuth } from "../../db/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useSignIn } from "./Auth";
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

export default function SignIn(props?: SignProps) {
  let data: FormData;

  const auth = useAuth();
  const signIn = useSignIn();

  const handleSignIn = () => {
    if (data) {
      let email = data.get("email");
      let password = data.get("password");
      if (!email || !password) {
        return;
      } else {
        signInWithEmailAndPassword(auth, email.toString(), password.toString())
          .then((cred) => {
            signIn.signIn(cred.user);
            alert(`Sign in ${cred.user.displayName} successfully`);
            // TODO: load user profile and jump page
          })
          .catch((err) => {
            alert(`Failed to sign in: ${err.message}`);
          });
      }
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = useAuth();
    signInWithPopup(auth, provider)
      .then((cred) => {
        signIn.signIn(cred.user);
        alert(`Sign in ${cred.user.displayName} successfully`);
        // TODO: load user profile and jump page
      })
      .catch((err) => {
        alert(`Failed to sign in: ${err.message}`);
      });
  };

  const handleType = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    console.log(data);
  };

  const linkHint = "Don't have an account? Sign Up";

  const RedirectLink = () => {
    return (
      <Link href={RoutePages.SIGN_UP.path} variant="body2">
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
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onChange={handleType}
          onSubmit={(ev) => {
            handleType(ev);
            handleSignIn();
          }}
          noValidate
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <EmailTextField {...{ focus: true }} />
            </Grid>
            <Grid item xs={12}>
              <PasswordTextField />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSignIn}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleGoogleSignIn}
            sx={{ mt: 3, mb: 2 }}
          >
            Or sign in with google
          </Button>
          <Grid item>{props ? <SwapLink /> : <RedirectLink />}</Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
