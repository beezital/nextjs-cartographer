"use client";

import { Alert, Button, InputAdornment } from '@mui/material';
import { ExploreOutlined } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import type { LatLngLiteral } from 'leaflet';
import { useLeafletHelper } from './useLeafletHelper';
import { LeafletMapContext } from './LeafletMapContext';


// https://github.com/PaulLeCam/react-leaflet/issues/1108#issuecomment-1806743358
import 'leaflet/dist/leaflet.css';

import { useContext, useEffect, useRef, useState } from "react";
import { AlertsContext } from './AlertsContexts';


const COORDINATES_PRECISION = 1000000;


function Coordinates() {

  const { mapCenterLatLong } = useContext(LeafletMapContext);
  const { centerMapOn } = useLeafletHelper();

  const [coordinates, setCoordinates] = useState("");

  useEffect(() => {
    if (!mapCenterLatLong) {
      return;
    }
    const lat = roundCoordinate(mapCenterLatLong.lat);
    const lng = roundCoordinate(mapCenterLatLong.lng);
    const latLongString = `${lat}, ${lng}`;
    setCoordinates(latLongString);
  }, [mapCenterLatLong]);

  function roundCoordinate(coord: number) {
    return Math.round(coord * COORDINATES_PRECISION) / COORDINATES_PRECISION;
  }

  function go(formData: FormData) {
    console.log("Form submitted:", formData.keys().toArray());
    const newCoordinates = formData.get("coordinates")?.toString() || "";
    let [lat, lng] = newCoordinates.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Parsed coordinates:", lat, lng);
      lat = roundCoordinate(lat);
      lng = roundCoordinate(lng);
      console.log("Parsed coordinates rounded:", lat, lng);
      const center: LatLngLiteral = { lat, lng };
      centerMapOn(center);
    }
  }

  return (
    <form action={go}>
      <TextField
        style={{ width: "100%" }}
        id='coordinates-input'
        label="Coordinates (Latitude, Longitude)"
        variant="outlined"
        name="coordinates"
        value={coordinates}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCoordinates(event.target.value);
        }}
        // https://mui.com/material-ui/react-text-field/#input-adornments
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">
              <Button variant='contained' type='submit'>Go</Button>
            </InputAdornment>
          }
        }}
      />
    </form>
  );
}

function Map() {

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { initMap, centerMapOnCurrentPosition } = useLeafletHelper();

  const { addError } = useContext(AlertsContext);

  useEffect(() => {
    console.log("about to init map (check strict mode double call)");
    if (mapContainerRef.current) {
      initMap(mapContainerRef.current, addError);
    }
    /*
    // Cleanup function needed?
    return () => {
      console.log("about to cleanup map");
      if (mapContainerRef.current) {
        mapContainerRef.current.remove();
        mapContainerRef.current = null;
      }
    };
    */
  }, [initMap, addError]);


  // Code more explicit than passing `centerMapOnCurrentPosition.bind(null, undefined)` to onClick in order to satisfy eslint
  function handleClick() {
    centerMapOnCurrentPosition(addError);
  }

  return (
    <div style={{ position: "relative", flexGrow: 1 }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }}></div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 500, display: "flex", gap: "1em", padding: "1em", justifyContent: "center" }}>
        <Button variant="contained" startIcon={<ExploreOutlined />} onClick={handleClick}>GPS</Button>
      </div>
    </div>
  )
}

function AlertList() {

  const { alerts, removeAlert } = useContext(AlertsContext);

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 500, padding: "1em", display: "flex", flexDirection: "column", gap: "1em", alignItems: "center" }}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id} variant="filled" severity={alert.severity}
          onClose={() => { removeAlert(alert.id); }}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}

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
