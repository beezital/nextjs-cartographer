"use client";

import { useEffect, useState } from 'react';
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";
import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import Map from '@/components/Map/Map';

import styles from './page.module.css';
import { AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

type Preferences = {
  isDrawerOpen: boolean;
}

export default function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>();
  const isDesktop = useMediaQuery('(min-width:600px)'); // https://www.browserstack.com/guide/responsive-design-breakpoints
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [auth, setAuth] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>();


  function loadPreferences(): Preferences {
    const prefsString = localStorage.getItem("preferences");
    if (prefsString) {
      try {
        const prefs = JSON.parse(prefsString) as Preferences;
        return prefs;
      } catch (e) {
        console.error("Could not parse preferences from localStorage", e);
      }
    }
    return { isDrawerOpen: true };
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function logout() {
    setAuth(false);
    handleClose();
  }

  function login() {
    setAuth(true);
    handleClose();
  }

  useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    setIsDrawerOpen(prefs.isDrawerOpen);
  }, []);


function toggleDrawer() {
    const newIsDrawerOpen = !isDrawerOpen;
    setIsDrawerOpen(newIsDrawerOpen);
    const newPreferences = { ...preferences, isDrawerOpen: newIsDrawerOpen };
    setPreferences(newPreferences);
    localStorage.setItem("preferences", JSON.stringify(newPreferences));
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="relative" >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon onClick={toggleDrawer} />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              beeziMap
            </Typography>
            {auth ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button color="inherit" onClick={login} >Login</Button>
            )}
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, alignItems: "stretch" }}>
          <div className={styles.drawerOverlay} style={{ display: !isDesktop && isDrawerOpen ? "block" : "none" }} onClick={toggleDrawer}></div>
          <div className={styles.drawer} style={{ width: drawerWidth, marginLeft: isDrawerOpen ? 0 : -drawerWidth }}>
            <span>App Navigation Drawer</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
              <h1>Leaflet test</h1>
              <Coordinates />
            </div>
            <Map />
            <AlertList />
          </div>
        </div>
      </div>
    </>
  );
}
