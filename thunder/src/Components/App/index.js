import React from "react";
import PropTypes from "prop-types";
// top nav
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
// drawer
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// bottom nav
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// icons
import InboxIcon from "@material-ui/icons/MoveToInbox";
import LockIcon from "@material-ui/icons/Lock";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import GitHubIcon from "@material-ui/icons/GitHub";

// pages
import ActivePage from "../ActivePage";
import AddPage from "../AddPage";
import SettingsPage from "../SettingsPage";

import style from "./style.module.css";

App.propTypes = {
  setService: PropTypes.func,
  setAppState: PropTypes.func,
  setBottomNavValue: PropTypes.func,
  bottomNavValue: PropTypes.string,
};

function App(props) {
  // open/close the drawer
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerState(open);
  };

  const navKey = {
    disabled: (
      <AddPage setService={props.setService} setAppState={props.setAppState} />
    ),
    enabled: (
      <ActivePage
        setService={props.setService}
        setAppState={props.setAppState}
      />
    ),
    settings: <SettingsPage setAppState={props.setAppState} />,
  };

  const list = (anchor) => (
    <div
      className={style.fullList}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => props.setAppState("premium")}>
          <ListItemIcon>
            <LocalActivityIcon />
          </ListItemIcon>
          <ListItemText primary="Activate Premium" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => props.setAppState("login")}>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <div className={style.flexGrow}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={style.marginRight}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      {navKey[props.bottomNavValue]}
      <BottomNavigation
        value={props.bottomNavValue}
        onChange={(event, newValue) => {
          props.setBottomNavValue(newValue);
        }}
        showLabels
        className={style.bottomNav}
      >
        <BottomNavigationAction
          value="disabled"
          label="Add"
          icon={<PlaylistAddIcon />}
        />

        <BottomNavigationAction
          value="enabled"
          label="Active"
          icon={<PlaylistAddCheckIcon />}
        />
        <BottomNavigationAction
          value="settings"
          label="Settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
      <Drawer anchor="left" open={drawerState} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}

export default App;
