import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
// icons
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import PowerOffIcon from "@material-ui/icons/PowerOff";
import style from "./style.module.css";

export default function SettingsPage(props) {
  return (
    <List className={style.root}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LocalActivityIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Activate Premium"
          secondary="Access backups, auto-updates, and more!"
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <VpnKeyIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Change Password"
          secondary="Change your master password"
        />
      </ListItem>
      <ListItem button onClick={() => props.setAppState("shutdown")}>
        <ListItemAvatar>
          <Avatar>
            <PowerOffIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Shutdown Device"
          secondary="Safely stop all services and shutdown"
        />
      </ListItem>
    </List>
  );
}
