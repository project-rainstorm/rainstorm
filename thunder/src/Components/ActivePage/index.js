import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";

import ServiceList from "../ServiceList";
import authHeader from "../../services/auth-header";

ActivePage.propTypes = {
  url: PropTypes.object,
  setAppState: PropTypes.func,
  setService: PropTypes.func,
};

function ActivePage(props) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    console.log(authHeader());
    fetch("/services", {
      headers: authHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code == 401) {
          props.setAppState("login");
        }
        if (data.status_code >= 400) {
          throw new Error("Something went wrong");
        }
        setServices(data.data);
      })
      .catch((data) => {
        console.log("error");
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
