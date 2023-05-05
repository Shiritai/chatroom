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
import { EmailTextField, PasswordTextField } from "./AuthTextField";
import Grid from "@mui/material/Grid";
import { RoutePages } from "../../util/router/RoutePages";
import { useAuth } from "../../db/firebase";
import {
  GoogleAuthProvider,
  UserCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useSignIn } from "./Auth";
import { SignProps } from "../../types/PagePropTypes";
import { useNavigate } from "react-router-dom";
// import { useInitDB } from "./ChatDB";
import MyAlert, { MyAlertProps, MyDefaultAlerts } from "../shared/MyAlert";

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
  // const initCDB = useInitDB();
  const nav = useNavigate();
  const [myAlert, setMyAlert] = React.useState(MyDefaultAlerts.NO_ALERT)

  const signInSuccess = (cred: UserCredential): UserCredential => {
    signIn.signIn(cred.user); // login user
    // initCDB.initCDB(cred.user)
    // load user profile and jump page
    let idol_template: MyAlertProps = {
      title: "Success!",
      body: `${cred.user.displayName} has logged in successfully :)`,
      src: MyDefaultAlerts.IDOL_SUC_ALERT.src,
      tag: "GO!",
      showing: MyDefaultAlerts.IDOL_SUC_ALERT.showing,
      onClose: () => {
        idol_template.showing = false
        nav(RoutePages.HOME.path)
      },
    }
    setMyAlert(idol_template);
    return cred
  }

  const signInFailed = (err: Error) => {
    let idol_template: MyAlertProps = {
      title: "Error!",
      body: `Failed to sign in: ${err.message}`,
      src: MyDefaultAlerts.IDOL_FAL_ALERT.src,
      tag: "Try again!",
      showing: MyDefaultAlerts.IDOL_FAL_ALERT.showing,
      severity: 'error',
      onClose: () => {
        idol_template.showing = false
        nav(RoutePages.SIGN_IN.path)
      },
    }
    setMyAlert(idol_template);
  }

  const handleSignIn = () => {
    if (data) {
      let email = data.get("email");
      let password = data.get("password");
      if (!email || !password) {
        return;
      } else {
        signInWithEmailAndPassword(auth, email.toString(), password.toString())
          .then(signInSuccess).catch(signInFailed);
      }
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    const auth = useAuth();
    signInWithPopup(auth, provider)
      .then(signInSuccess).catch(signInFailed);
  };

  const handleType = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    data = new FormData(event.currentTarget);
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
      <MyAlert {...myAlert} />
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
            color='warning'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleGoogleSignIn}
            color="success"
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
