"use client";

import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import Map from '@/components/Map/Map';


export default function Home() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
          <h1>Leaflet test</h1>
          <Coordinates />
        </div>
        <Map />
      </div>
      <AlertList />
    </>
  );
}
