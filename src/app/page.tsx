"use client";

import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import Map from '@/components/Map/Map';

import styles from './page.module.css';

const drawerWidth = 240;


export default function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width:768px)'); // https://www.browserstack.com/guide/responsive-design-breakpoints
  
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div className={styles.header} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <span>App Header</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexGrow: 1, alignItems: "stretch" }}>
          <div className={styles.drawerOverlay} style={{ display: isMobile && isDrawerOpen ? "block" : "none" }} onClick={() => setIsDrawerOpen(false)}></div>
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
