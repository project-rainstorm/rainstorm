import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";

// icons
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import BrightnessIcon from "@material-ui/icons/Brightness6";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import PowerOffIcon from "@material-ui/icons/PowerSettingsNew";
import style from "./style.module.css";

SettingsPage.propTypes = {
  setAppState: PropTypes.func,
  darkMode: PropTypes.bool,
  setDarkMode: PropTypes.func,
};

function SettingsPage(props) {
  const toggleDarkMode = () => {
    props.setDarkMode(!props.darkMode);
    localStorage.setItem("darkMode", !props.darkMode);
  };

  return (
    <Container maxWidth="md">
      <List className={style.root}>
        <ListItem button onClick={() => props.setAppState("premium")}>
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

        <ListItem button onClick={toggleDarkMode}>
          <ListItemAvatar>
            <Avatar>
              <BrightnessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`Turn ${props.darkMode ? "off" : "on"} Dark Mode`}
            secondary="Toggle your prefered theme"
          />
        </ListItem>
        <ListItem button onClick={() => props.setAppState("password")}>
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
    </Container>
  );
}
export default SettingsPage;
