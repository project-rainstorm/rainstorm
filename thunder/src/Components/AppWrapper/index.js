import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

// Main App Views
import App from "../App";
import Login from "../Login";
import Shutdown from "../Shutdown";
import ServiceView from "../ServiceView";
import Premium from "../Premium";
import ChangePass from "../ChangePass";

const baseUrl = window.location.href.split(":").splice(0, 2).join(":");
const url = { base: baseUrl, api: baseUrl + ":5000" };

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AppWrapper() {
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem("darkMode") === "true" ? true : false
  );
  const darkModeTheme = {
    primary: {
      main: "#5ce1e6",
    },
    secondary: {
      main: "#f50057",
    },
  };
  const theme = React.useMemo(() => {
    const buildTheme = () => ({
      palette: {
        type: darkMode ? "dark" : "light",
        ...(darkMode && { ...darkModeTheme }),
      },
    });
    console.log({ buildTheme: buildTheme() });
    return createMuiTheme(buildTheme());
  });

  // set app state
  const [appState, setAppState] = React.useState("app");
  // set selected service
  const [service, setService] = React.useState(null);
  // set bottom nav of App
  const [bottomNavValue, setBottomNavValue] = React.useState("enabled");
  // set alert
  const [alert, setShowAlert] = React.useState(false);
  const [alertText, setAlertText] = React.useState(null);
  const [alertSeverity, setAlertSeverity] = React.useState(null);
  const showAlert = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setShowAlert(true);
  };

  const appKey = {
    login: <Login url={url} setAppState={setAppState} showAlert={showAlert} />,
    app: (
      <App
        url={url}
        setAppState={setAppState}
        setService={setService}
        bottomNavValue={bottomNavValue}
        setBottomNavValue={setBottomNavValue}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
      />
    ),
    service: (
      <ServiceView url={url} service={service} setAppState={setAppState} />
    ),
    shutdown: <Shutdown />,
    password: <ChangePass setAppState={setAppState} showAlert={showAlert} />,
    premium: <Premium setAppState={setAppState} />,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {appKey[appState]}
      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity}>
          {alertText}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
