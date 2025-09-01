"use client";

// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

// https://geoservices.ign.fr/documentation/services/utilisation-web/extension-pour-leaflet#appel-de-lextension-dans-un-module-es6
// import L from "leaflet";
// import { LExtended } from "geoportal-extensions-leaflet";

import { useEffect } from "react";

export default function Home() {


  useEffect(() => {
    async function initMap() {
      // const L = (await import("leaflet")).default;
      const Gp = (await import("geoportal-extensions-leaflet"));

      const map = Gp.LExtended.map('map').setView([48, 7], 13);

      // Gp.LExtended.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   maxZoom: 19,
      //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      // }).addTo(map);

      // const lyr = Gp.LExtended.geoportalLayer.WMTS({
      //   layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"
      // });
      // lyr.addTo(map);

      // https://geoservices.ign.fr/documentation/services/utilisation-web/affichage-wmts/leaflet-et-wmts
      Gp.LExtended.tileLayer(
        "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal" +
        "&TILEMATRIXSET=PM" +
        // "&FORMAT=image/jpeg" +
        // "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
        "&FORMAT=image/png" +
        "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
        "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}",
        {
          minZoom: 0,
          maxZoom: 18,
          attribution: "IGN-F/Geoportail",
          tileSize: 256 // les tuiles du Géooportail font 256x256px
        }
      ).addTo(map);

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
