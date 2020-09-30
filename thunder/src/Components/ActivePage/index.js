import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";

import ServiceList from "../ServiceList";

ActivePage.propTypes = {
  url: PropTypes.object,
  setAppState: PropTypes.func,
  setService: PropTypes.func,
};

function ActivePage(props) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <ServiceList
        url={props.url}
        services={services.filter((s) => s.status === "enabled")}
        setAppState={props.setAppState}
        setService={props.setService}
      />
    </Container>
  );
}

export default ActivePage;
