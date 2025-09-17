"use client";

import { useEffect, useState } from 'react';
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from "@mui/icons-material";
import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import Map from '@/components/Map/Map';

import styles from './page.module.css';
import { AccountCircle } from '@mui/icons-material';

// https://firebase.google.com/docs/web/setup

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX8UamBQeZiFZ6MqFKI-qOGxc7hSSxdRg",
  authDomain: "beezimap-dev.firebaseapp.com",
  projectId: "beezimap-dev",
  storageBucket: "beezimap-dev.firebasestorage.app",
  messagingSenderId: "968728684510",
  appId: "1:968728684510:web:795197755788f0e11cdf4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.setCustomParameters({ prompt: 'select_account' });


const drawerWidth = 240;

type Preferences = {
  isDrawerOpen: boolean;
}

export default function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>();
  const isDesktop = useMediaQuery('(min-width:600px)'); // https://www.browserstack.com/guide/responsive-design-breakpoints
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
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
    handleClose();
    signOut(auth)
  }

  function login() {
    // https://firebase.google.com/docs/auth/web/google-signin
    signInWithPopup(auth, googleProvider)
  }

  useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    setIsDrawerOpen(prefs.isDrawerOpen);

    // https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // ...
        console.log("User logged in", user);
        setUser(user);
      } else {
        // User is signed out
        // ...
        console.log("User logged out");
        setUser(null);
      }
    });
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
            {user ? (
              <div>
                {isDesktop ? (
                  <Button
                    variant="contained"
                    size="large"
                    disableElevation
                    startIcon={<AccountCircle />}
                    onClick={handleMenu}
                    sx={{ textTransform: 'none' }}
                  >
                    {user.displayName}
                  </Button>
                ) : (
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
                )}
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
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
                  <MenuItem disabled>{user.displayName}</MenuItem>
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
