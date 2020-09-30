import React from "react";
// Main App Views
import App from "../App";
import Login from "../Login";
import Shutdown from "../Shutdown";
import ServiceView from "../ServiceView";
import Premium from "../Premium";
import ChangePass from "../ChangePass";

const baseUrl = window.location.href.split(":").splice(0, 2).join(":");
const url = { base: baseUrl, api: baseUrl + ":5000" };

export default function AppWrapper() {
  // set app state
  const [appState, setAppState] = React.useState("app");
  // set selected service
  const [service, setService] = React.useState(null);
  // set bottom nav of App
  const [bottomNavValue, setBottomNavValue] = React.useState("enabled");

  const appKey = {
    login: <Login setAppState={setAppState} />,
    app: (
      <App
        url={url}
        setAppState={setAppState}
        setService={setService}
        bottomNavValue={bottomNavValue}
        setBottomNavValue={setBottomNavValue}
      />
    ),
    service: (
      <ServiceView url={url} service={service} setAppState={setAppState} />
    ),
    shutdown: <Shutdown />,
    password: <ChangePass setAppState={setAppState} />,
    premium: <Premium setAppState={setAppState} />,
  };

  return appKey[appState];
}
