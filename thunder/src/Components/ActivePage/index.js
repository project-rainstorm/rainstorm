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
    fetch("/services", {
      headers: authHeader(),
    })
      .then((res) => {
        if (res.status === 401) {
          props.setAppState("login");
          return;
        } else if (res.status >= 400) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
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
