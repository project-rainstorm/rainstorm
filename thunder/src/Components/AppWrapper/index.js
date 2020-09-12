import React from "react";
// Main App Views
import App from "../App";
import Login from "../Login";
import Shutdown from "../Shutdown";

export default function AppWrapper() {
  // set app state logged in/logged out/shutdown
  const [appState, setAppState] = React.useState(1);
  const appKey = [
    <Login setAppState={setAppState} />,
    <App setAppState={setAppState} />,
    <Shutdown />
  ];
  return appKey[appState];
}
