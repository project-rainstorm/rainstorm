import "babel-polyfill";
import React, { useEffect, useState } from "react";
import style from './style.css';
import Tabs from "./components/Tabs";
// pages
import Market from "./pages/Market";
import NewJob from "./pages/NewJob";

function App() {
  const [services, setServices] = useState(null);

  useEffect(() => {
    fetch('/services').then(res => res.json()).then(data => {
      setServices(data.data)
    });	  
  }, []);

  return (
    <div className={style.app}>
      {services && services.map((service) => (
        <div>{service.name}</div>
       ))
      }
    </div>
  );
}

export default App;
