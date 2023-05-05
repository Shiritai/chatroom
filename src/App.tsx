import "./styles/App.css";
import { Routes, Route } from "react-router-dom";
import { PageStream, RoutePages } from "./util/router/RoutePages";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Routes>
          {PageStream.map((ele, index) => (
            <Route key={index} path={ele.path} element={ele.component()} />
          ))}
          
          <Route path="*" element={RoutePages.PAGE_404.component()} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
