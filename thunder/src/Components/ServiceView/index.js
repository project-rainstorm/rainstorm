import React from "react";
import PropTypes from "prop-types";
// content
import BackAppBar from "../BackAppBar";
import Header from "./Header";
import ActionList from "./ActionList";
import Container from "@material-ui/core/Container";

ServiceView.propTypes = {
  url: PropTypes.object,
  setAppState: PropTypes.func,
  service: PropTypes.object,
};

function ServiceView(props) {
  return (
    <div>
      <BackAppBar backTo="app" setAppState={props.setAppState} />
      <Container maxWidth="md">
        <Header url={props.url} service={props.service} />
        <ActionList url={props.url} service={props.service} />
      </Container>
    </div>
  );
}
export default ServiceView;
