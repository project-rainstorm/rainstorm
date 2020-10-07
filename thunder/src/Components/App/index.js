import React from "react";
import PropTypes from "prop-types";
// top nav
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
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
import LockIcon from "@material-ui/icons/Lock";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";

// pages
import ActivePage from "../ActivePage";
import AddPage from "../AddPage";
import SettingsPage from "../SettingsPage";

import style from "./style.module.css";

App.propTypes = {
  url: PropTypes.object,
  setService: PropTypes.func,
  setAppState: PropTypes.func,
  setBottomNavValue: PropTypes.func,
  bottomNavValue: PropTypes.string,
  setDarkMode: PropTypes.func,
  darkMode: PropTypes.bool
};

function App(props) {
  // open/close the drawer
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer = open => event => {
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
      <AddPage
        url={props.url}
        setService={props.setService}
        setAppState={props.setAppState}
      />
    ),
    enabled: (
      <ActivePage
        url={props.url}
        setService={props.setService}
        setAppState={props.setAppState}
      />
    ),
    settings: (
      <SettingsPage
        setAppState={props.setAppState}
        setDarkMode={props.setDarkMode}
        darkMode={props.darkMode}
      />
    )
  };

  const list = anchor => (
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
        <AppBar position="fixed">
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
