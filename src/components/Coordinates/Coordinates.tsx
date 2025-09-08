import { useContext } from "react";
import type { LatLngLiteral } from 'leaflet';
import { TextField, InputAdornment, Button } from '@mui/material';
import { Gamepad } from '@mui/icons-material';
import { LeafletMapContext } from "../../contexts/LeafletMapContext";
import { useLeafletHelper } from "../../hooks/useLeafletHelper";
import { useEffect, useState } from "react";

import styles from './Coordinates.module.css';

// Precision for displaying coordinates
const COORDINATES_PRECISION = 1_000_000;


export default function Coordinates() {

  const { mapCenterLatLong } = useContext(LeafletMapContext);
  const { centerMapOn, showTargetLocationMarkerAt } = useLeafletHelper();

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

  function show(formData: FormData) {
    console.log("Form submitted:", formData.keys().toArray());
    const newCoordinates = formData.get("coordinates")?.toString() || "";
    let [lat, lng] = newCoordinates.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Parsed coordinates:", lat, lng);
      lat = roundCoordinate(lat);
      lng = roundCoordinate(lng);
      console.log("Parsed coordinates rounded:", lat, lng);
      const targetLocation: LatLngLiteral = { lat, lng };

      centerMapOn(targetLocation);
      showTargetLocationMarkerAt(targetLocation);
    }
  }

  return (
    <form action={show}>
      <TextField
        className={styles.coordinates}
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
              <Button variant='contained' startIcon={<Gamepad />} type='submit'>Show</Button>
            </InputAdornment>
          }
        }}
      />
    </form>
  );
}