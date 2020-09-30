import React from "react";
import PropTypes from "prop-types";
// content
import BackAppBar from "../BackAppBar";
import Header from "./Header";
import ActionList from "./ActionList";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
        <Header service={props.service} />
        <ActionList url={props.url} service={props.service} />
      </Container>
    </div>
  );
}
export default ServiceView;
