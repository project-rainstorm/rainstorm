import React, { useState } from "react";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from "@material-ui/lab";
// Icons
import LaunchIcon from "@material-ui/icons/Launch";
import LoopIcon from "@material-ui/icons/Loop";
import CheckIcon from "@material-ui/icons/Check";
import FolderIcon from "@material-ui/icons/Folder";
import Input from "./Input";
import Select from "./Select";
import ModalForm from "./ModalForm";

import style from "./style.module.css";

ActionList.propTypes = {
  url: PropTypes.object,
  service: PropTypes.object,
};

function ActionList(props) {
  const [service, setService] = useState(props.service);
  const [loading, setLoading] = useState(false);
  const [restarting, setRestarting] = useState(false);

  const enableService = () => {
    setLoading(true);
    fetch(`/services/${props.service.name}/enable`, { method: "post" })
      .then((res) => res.json())
      .then((data) => {
        setService(data.data);
        setLoading(false);
      });
  };

  const disableService = () => {
    setLoading(true);
    fetch(`/services/${props.service.name}/disable`, { method: "post" })
      .then((res) => res.json())
      .then((data) => {
        setService(data.data);
        setLoading(false);
      });
  };

  const restartService = () => {
    setLoading(true);
    setRestarting(true);
    fetch(`/services/${props.service.name}/restart`, { method: "post" })
      .then((res) => res.json())
      .then((data) => {
        setService(data.data);
        setLoading(false);
        setRestarting(false);
      });
  };

  const getField = (field) => {
    if (field.field === "input") {
      return <Input field={field} service={service} setService={setService} />;
    }
    return <Select field={field} service={service} setService={setService} />;
  };

  const hasAction = service.settings.open_link || service.status !== "enabled";

  const getTopBtnIcon = () => {
    if (!hasAction) {
      return <CheckIcon />;
    }
    if (loading) {
      return <LoopIcon className={style.spin} />;
    }
    if (service.status === "enabled") {
      return <LaunchIcon />;
    } else {
      return <CheckIcon />;
    }
  };

  const getTopBtnText = () => {
    if (!hasAction) {
      return "Running";
    }
    if (restarting) {
      return "Restarting";
    }
    if (loading) {
      if (service.status === "enabled") {
        return "Stopping";
      } else {
        return "Starting";
      }
    }
    return service.status === "enabled" ? "Open" : "Enable";
  };

  const getTopBtnOnClick = () => {
    if (!hasAction) {
      return null;
    }
    return service.status === "enabled" ? () => null : enableService;
  };

  const getTopBtnHref = () => {
    if (!hasAction) {
      return null;
    }
    return service.status === "enabled"
      ? props.url.base + props.service.settings.open_link
      : null;
  };

  return (
    <div>
      <div className={style.bar}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={getTopBtnIcon()}
          onClick={getTopBtnOnClick()}
          href={getTopBtnHref()}
        >
          {getTopBtnText()}
        </Button>
      </div>
      <List className={style.root}>
        {service.needs_update && (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={restartService}>
                APPLY
              </Button>
            }
          >
            <AlertTitle>Info</AlertTitle>
            These settings have not been applied.
          </Alert>
        )}
        {service.settings.var_fields.map((field) => {
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
                    {field.value || field.default}
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
        {service.status === "enabled" && (
          <Button color="secondary" size="large" onClick={disableService}>
            Disable
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionList;
