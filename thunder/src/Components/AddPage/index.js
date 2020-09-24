import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import ServiceList from "../ServiceList";

AddPage.propTypes = {
  setAppState: PropTypes.func,
  setService: PropTypes.func,
};

function AddPage(props) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data);
      });
  }, []);

  return (
    <div>
      <ServiceList
        services={services.filter((s) => s.status !== "enabled")}
        setAppState={props.setAppState}
        setService={props.setService}
      />
    </div>
  );
}

export default AddPage;
