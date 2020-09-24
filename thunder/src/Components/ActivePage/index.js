import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import style from "./style.module.css";

export default function ActivePage(props) {
  const [services, setServices] = useState(null);

  useEffect(() => {
    fetch("/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data);
      });
  }, []);

  const handleClick = (service) => {
    props.setService(service);
    props.setAppState("service");
  };

  return (
    <div>
      <List className={style.root}>
        {services &&
          services
            .filter((service) => service.status === "enabled")
            .map((service) => {
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
                        "http://nuve.local:5000/static/images/" +
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
            })}
      </List>
    </div>
  );
}
