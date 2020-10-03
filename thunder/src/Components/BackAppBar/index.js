import React from "react";
import PropTypes from "prop-types";

// top nav
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

// icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import style from "./style.module.css";

BackAppBar.propTypes = {
  backTo: PropTypes.string,
  setAppState: PropTypes.func,
};

function BackAppBar(props) {
  return (
    <div className={style.flexGrow}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={style.marginRight}
            color="inherit"
            aria-label="back"
            onClick={() => props.setAppState(props.backTo)}
          >
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default BackAppBar;
