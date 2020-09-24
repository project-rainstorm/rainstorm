import React from "react";
import PropTypes from "prop-types";

// content
import BackAppBar from "../BackAppBar";
import Container from "@material-ui/core/Container";

Premium.propTypes = {
  setAppState: PropTypes.func,
};

function Premium(props) {
  return (
    <div>
      <BackAppBar backTo="app" setAppState={props.setAppState} />
      <Container maxWidth="md">
        <h2>Activate Premium</h2>
      </Container>
    </div>
  );
}

export default Premium;
