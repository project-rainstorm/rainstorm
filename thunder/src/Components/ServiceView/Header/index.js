import React from "react";
import PropTypes from "prop-types";
// content
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import style from "./style.module.css";

Header.propTypes = {
  service: PropTypes.object,
};

function Header(props) {
  const handleClick = () => {
    // enable the service
    console.log("hello");
  };

  return (
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
      {props.service.settings.open_link && (
        <div className={style.btns}>
          <Button
            variant="contained"
            color="primary"
            onClick={
              props.service.status === "enabled" ? () => null : handleClick
            }
            href={
              props.service.status === "enabled"
                ? "http://nuve.local" + props.service.settings.open_link
                : null
            }
          >
            {props.service.status === "enabled" ? "Open" : "Enable"}
          </Button>
        </div>
      )}
    </div>
  );
}
export default Header;
