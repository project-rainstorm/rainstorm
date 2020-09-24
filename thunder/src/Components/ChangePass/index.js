import React from "react";
import PropTypes from "prop-types";

// content
import BackAppBar from "../BackAppBar";
import Container from "@material-ui/core/Container";

ChangePass.propTypes = {
  setAppState: PropTypes.func,
};

function ChangePass(props) {
  return (
    <div>
      <BackAppBar backTo="app" setAppState={props.setAppState} />
      <Container maxWidth="md">
        <h2>Change Password</h2>
      </Container>
    </div>
  );
}

export default ChangePass;
