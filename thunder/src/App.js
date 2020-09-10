import "babel-polyfill";
import React from "react";
import style from './style.css';
import Tabs from "./components/Tabs";
// pages
import Market from "./pages/Market";
import NewJob from "./pages/NewJob";

function App() {
  const tabList = [
    { name: "market", label: "Marketplace", content: Market },
    { name: "newjob", label: "New Job", content: NewJob }
  ];
  return (
    <div className={style.app}>
      <Tabs tabList={tabList} />
      <header className={style.appHeader}>
        <p>
          <code>p2print</code>
        </p>
      </header>
    </div>
  );
}

export default App;
