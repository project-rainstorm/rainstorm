import React, { useEffect, useState } from "react";
import style from './style.module.css';

export default function App() {
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
