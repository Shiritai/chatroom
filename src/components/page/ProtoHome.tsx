import reactLogo from "/src/assets/react.svg";
import viteLogo from "/src/assets/vite.svg";
import "/src/styles/App.css";
import styled from "@emotion/styled";
import { APP_NAME, Header, PROJECT } from "../shared/Header";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { RoutePages } from "../../controller/router/RoutePages";
import { Grid } from "@mui/material";

function SignButtons() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          m: 1,
        },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            size="large"
            key="sign in"
            onMouseEnter={() => {}} // TODO: change hover color
            href={RoutePages.SIGN_IN.path}
            variant="contained"
          >
            {RoutePages.SIGN_IN.name}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            size="large"
            key="sign in/up"
            onMouseEnter={() => {}} // TODO: change hover color
            href={RoutePages.SIGN.path}
            variant="contained"
          >
            {RoutePages.SIGN.name}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            size="large"
            key="sign up"
            onMouseEnter={() => {}} // TODO: change hover color
            href={RoutePages.SIGN_UP.path}
            variant="contained"
          >
            {RoutePages.SIGN_UP.name}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

const Code = styled.p`
  color: #cd5c5c;
  font-size: 30px;
  font-family: monospace;
  font-weight: bold;
`;

function ProtoHome(title?: string) {
  const tsLogo =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png";
  const yarnLogo =
    "https://seeklogo.com/images/Y/yarn-logo-F5E7A65FA2-seeklogo.com.png";
  const firebaseLogo =
    "https://www.gstatic.com/devrel-devsite/prod/v12ed1568ba335cc0f2889d02f1380222f752f997d826a87d8efa42899ed696be/firebase/images/touchicon-180.png";
  const muiLogo = "https://mui.com/static/logo.png";

  const logoData = [
    { name: "Yarn", link: "https://yarnpkg.com/", img: yarnLogo },
    { name: "Vite", link: "https://vitejs.dev", img: viteLogo },
    { name: "React", link: "https://react.dev", img: reactLogo },
    {
      name: "Typescript",
      link: "https://www.typescriptlang.org/",
      img: tsLogo,
    },
    {
      name: "Firebase",
      link: "https://firebase.google.com/",
      img: firebaseLogo,
    },
    { name: "Material UI", link: "https://mui.com/", img: muiLogo },
  ];

  return () => (
    <>
      <Header />
      {title ? <h1>{title}</h1> : <></>}
      <h1>{`${APP_NAME} | ${PROJECT}`}</h1>
      <h2>{`Powered by ${logoData.map((ele) => ele.name).join(" + ")}`}</h2>
      <div>
        {logoData.map((ele) => (
          <a href={ele.link} target="_blank">
            <img src={ele.img} className="logo" alt={`${ele.name} logo`} />
          </a>
        ))}
      </div>
      <div className="card">
        <SignButtons />
        <p>
          See github repository{" "}
          <a href="https://github.com/Shiritai/chatroom">
            <Code>chatroom</Code>
          </a>{" "}
          for more details
        </p>
      </div>
      <p className="read-the-docs">
        Click on the logos to learn more about each frameworks
      </p>
    </>
  );
}

export default ProtoHome;
