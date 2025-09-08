"use client";

import Coordinates from '@/components/Coordinates/Coordinates';
import AlertList from '@/components/AlertList/AlertList';
import LeafletMap from '@/components/LeafletMap/LeafletMap';


export default function Home() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", padding: "1em" }}>
          <h1>Leaflet test</h1>
          <Coordinates />
        </div>
        <LeafletMap />
      </div>
      <AlertList />
    </>
  );
}
