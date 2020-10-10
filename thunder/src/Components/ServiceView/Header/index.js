import React from "react";
import PropTypes from "prop-types";
// content
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";

import style from "./style.module.css";

Header.propTypes = {
  service: PropTypes.object,
  url: PropTypes.object,
};

function Header(props) {
  return (
    <div className={style.header}>
      <div className={style.hero}>
        <img
          className={style.icon}
          alt={props.service.name}
          src={props.url.api + "/static/images/" + props.service.name + ".jpg"}
        />
        <Typography variant="h4">{props.service.settings.name}</Typography>
        <Typography>{props.service.settings.description}</Typography>
        <div className={style.links}>
          {props.service.settings.links.map((link) => (
            <Chip
              key={link.label}
              label={link.label}
              className={style.link}
              component="a"
              href={link.url}
              clickable
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Header;
