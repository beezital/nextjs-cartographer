"use client";

import { useEffect, useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer';
import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import Map from '@/components/Map/Map';
import UserMenu from '@/components/UserMenu/UserMenu';

import styles from './page.module.css';



type Preferences = {
  isDrawerOpen: boolean;
}

export default function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
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
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <AppBar position="relative" sx={{ zIndex: 1201 }}>
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
            <UserMenu />
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, alignItems: "stretch" }}>
          <NavigationDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
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
