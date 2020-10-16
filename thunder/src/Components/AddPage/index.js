import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";

import ServiceList from "../ServiceList";
import authHeader from "../../services/auth-header";

AddPage.propTypes = {
  url: PropTypes.object,
  setAppState: PropTypes.func,
  setService: PropTypes.func
};

function AddPage(props) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/services", {
      headers: authHeader()
    })
      .then(res => res.json())
      .then(data => {
        if (data.status_code === 401) {
          props.setAppState("login");
        }
        setServices(data.data);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <ServiceList
        url={props.url}
        services={services.filter(s => s.status !== "enabled")}
        setAppState={props.setAppState}
        setService={props.setService}
      />
    </Container>
  );
}

export default AddPage;
