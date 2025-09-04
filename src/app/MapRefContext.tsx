import { createContext, RefObject, useRef } from "react";
import type { Map as LeafletMap } from 'leaflet';

export const MapRefContext = createContext<RefObject<LeafletMap | null>>({ current: null });

export function MapRefProvider({ children }: { children: React.ReactNode }) {

    const mapRef = useRef<LeafletMap | null>(null);

    return (
        <MapRefContext.Provider value={mapRef}>
            {children}
        </MapRefContext.Provider>
    );
}