import React from "react";
// top nav
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// content
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

// icons
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import style from "./style.module.css";

export default function ServiceView(props) {
  console.log(props.service);
  return (
    <div>
      <div className={style.flexGrow}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={style.marginRight}
              color="inherit"
              aria-label="back"
              onClick={() => props.setAppState("app")}
            >
              <ArrowBackIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <div className={style.header}>
        <div className={style.hero}>
          <img
            className={style.icon}
            alt={props.service.name}
            src={
              "http://nuve.local:5000/static/images/" +
              props.service.name +
              ".jpg"
            }
          />
          <div>
            <Typography variant="h4">{props.service.settings.name}</Typography>
            <Typography>{props.service.settings.description}</Typography>
            <div className={style.links}>
              {props.service.settings.links.map((link) => (
                <Chip
                  key={link.label}
                  label={link.label}
                  component="a"
                  href={link.url}
                  clickable
                />
              ))}
            </div>
          </div>
        </div>
        <div className={style.btns}>
          <Button variant="contained" color="primary">
            {props.service.status === "enabled" ? "Open" : "Enable"}
          </Button>
        </div>
      </div>
      {props.service.status === "enabled" && (
        <Button variant="contained" color="secondary">
          Disable
        </Button>
      )}
    </div>
  );
}
