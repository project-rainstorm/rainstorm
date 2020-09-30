import React from "react";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Skeleton from "react-loading-skeleton";
import style from "./style.module.css";

ServiceList.propTypes = {
  url: PropTypes.object,
  setService: PropTypes.func,
  setAppState: PropTypes.func,
  services: PropTypes.array,
};

function ServiceList(props) {
  const handleClick = (service) => {
    props.setService(service);
    props.setAppState("service");
  };

  return (
    <div>
      <List className={style.root}>
        {props.services.length > 0
          ? props.services.map((service) => {
              return (
                <ListItem
                  key={service.name}
                  button
                  onClick={() => handleClick(service)}
                  alignItems="center"
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={service.name}
                      src={
                        props.url.api +
                        "/static/images/" +
                        service.name +
                        ".jpg"
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={service.settings.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          className={style.inline}
                          color="textPrimary"
                        ></Typography>
                        {service.settings.description}
                      </React.Fragment>
                    }
                  />
                  <FiberManualRecordIcon
                    className={
                      service.status === "enabled" ? style.on : style.off
                    }
                  />
                </ListItem>
              );
            })
          : [1, 2, 3, 4, 5].map((i) => (
              <ListItem key={i} alignItems="center">
                <ListItemAvatar>
                  <Skeleton circle={true} width={40} height={40} />
                </ListItemAvatar>

                <ListItemText
                  primary={<Skeleton width={250} />}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={style.inline}
                        color="textPrimary"
                      ></Typography>
                      <Skeleton width={400} />
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
      </List>
    </div>
  );
}
export default ServiceList;
