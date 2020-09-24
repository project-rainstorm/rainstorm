import React from "react";
// Main App Views
import App from "../App";
import Login from "../Login";
import Shutdown from "../Shutdown";
import ServiceView from "../ServiceView";

export default function AppWrapper() {
  // set app state logged in/logged out/shutdown
  const [appState, setAppState] = React.useState("app");
  const [service, setService] = React.useState(null);

  const appKey = {
    login: <Login setAppState={setAppState} />,
    app: <App setAppState={setAppState} setService={setService} />,
    service: <ServiceView service={service} setAppState={setAppState} />,
    shutdown: <Shutdown />,
  };
  return appKey[appState];
}
