"use client";

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

import { useEffect } from "react";

export default function Home() {


  useEffect(() => {
    async function initMap() {
      const L = (await import("leaflet")).default;
      const map = L.map('map').setView([48, 7], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    }
    initMap();
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <h1>Leaflet test</h1>
        {/* <div style={{ flexGrow: 1, border: "1px solid red" }}></div> */}
        <div id="map" style={{ flexGrow: 1 }}></div>
      </div>
    </>
  );
}
