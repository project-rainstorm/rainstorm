import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// Icons
import LaunchIcon from "@material-ui/icons/Launch";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckIcon from "@material-ui/icons/Check";
import FolderIcon from "@material-ui/icons/Folder";
import Input from "./Input";
import Select from "./Select";
import ModalForm from "./ModalForm";

import style from "./style.module.css";

ActionList.propTypes = {
  service: PropTypes.object,
};

function ActionList(props) {
  const [services, setServices] = useState([]);

  const enableService = () => {
    fetch(`/services/${props.service.name}/enable`, { method: "post" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const disableService = () => {
    fetch(`/services/${props.service.name}/disable`, { method: "post" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const getField = (field) => {
    if (field.field === "input") {
      return <Input field={field} service={props.service} />;
    }
    return <Select field={field} service={props.service} />;
  };

  const showBtn =
    props.service.settings.open_link || props.service.status !== "enabled";

  return (
    <div>
      <div className={style.bar}>
        {showBtn && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={
              props.service.status === "enabled" ? (
                <LaunchIcon />
              ) : (
                <CheckIcon />
              )
            }
            onClick={
              props.service.status === "enabled" ? () => null : enableService
            }
            href={
              props.service.status === "enabled"
                ? "http://nuve.local" + props.service.settings.open_link
                : null
            }
          >
            {props.service.status === "enabled" ? "Open" : "Enable"}
          </Button>
        )}
      </div>
      <List className={style.root}>
        {props.service.settings.var_fields.map((field) => {
          const List = (
            <ListItem button alignItems="center">
              <ListItemAvatar>
                <Avatar alt={field.label}>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={field.label}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={style.inline}
                      color="textPrimary"
                    ></Typography>
                    {field.value}
                  </React.Fragment>
                }
              />
            </ListItem>
          );
          return (
            <ModalForm key={field.name} trigger={List} btnText="Save">
              {getField(field)}
            </ModalForm>
          );
        })}
      </List>
      <div className={style.bar}>
        {props.service.status === "enabled" && (
          <Button color="secondary" size="large" onClick={disableService}>
            Disable
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionList;
