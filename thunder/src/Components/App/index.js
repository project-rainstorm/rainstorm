import React from "react";
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
import GitHubIcon from "@material-ui/icons/GitHub";

// pages
import ActivePage from "../ActivePage";
import AddPage from "../AddPage";
import SettingsPage from "../SettingsPage";

import style from "./style.module.css";

export default function App(props) {
  // toggle active bottom nav
  const [bottomNavValue, setBottomNavValue] = React.useState(1);

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

  const navKey = [
    <AddPage />,
    <ActivePage />,
    <SettingsPage setAppState={props.setAppState} />,
  ];

  const list = (anchor) => (
    <div
      className={style.fullList}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button>
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          <ListItemText primary="Contribute" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LocalActivityIcon />
          </ListItemIcon>
          <ListItemText primary="Activate Premium" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => props.setAppState(0)}>
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
      {navKey[bottomNavValue]}
      <BottomNavigation
        value={bottomNavValue}
        onChange={(event, newValue) => {
          setBottomNavValue(newValue);
        }}
        showLabels
        className={style.bottomNav}
      >
        <BottomNavigationAction label="Add" icon={<PlaylistAddIcon />} />

        <BottomNavigationAction
          label="Active"
          icon={<PlaylistAddCheckIcon />}
        />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
      <Drawer anchor="left" open={drawerState} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}
