import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from "react-map-gl";
import { GlobalContext } from "context";
import SiteSelectionMapPin from "./SiteSelectionMapPin";
import "assets/style/SiteSelectionMap.css";
import {
  MAP_BOX_WIDTH,
  MAP_BOX_HEIGHT,
  MAP_BOX_TOKEN,
} from "constants/Constants";

const SiteSelectionMap = () => {
  const { mapBoxCoordinate, setMapBoxCoordinate } = useContext(GlobalContext);

  const [viewport, setViewport] = useState({
    latitude: Number(mapBoxCoordinate.lat),
    longitude: Number(mapBoxCoordinate.lng),
    zoom: 14,
  });

  useEffect(() => {
    setViewport({
      latitude: Number(mapBoxCoordinate.lat),
      longitude: Number(mapBoxCoordinate.lng),
      zoom: 14,
    });
  }, [mapBoxCoordinate]);

  const addPinToMap = (event) => {
    setMapBoxCoordinate({
      lat: event.lngLat[1],
      lng: event.lngLat[0],
      input: "MapBox",
    });
  };

  return (
    <div className="mapbox">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        transitionDuration={"auto"}
        transitionInterpolator={new FlyToInterpolator({ speed: 1.2 })}
        mapboxApiAccessToken={MAP_BOX_TOKEN}
        onViewportChange={(nextViewport) => {
          setViewport(nextViewport);
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={addPinToMap}
      >
        <div className="navi-control">
          <NavigationControl />
        </div>
        <Marker
          latitude={Number(mapBoxCoordinate.lat)}
          longitude={Number(mapBoxCoordinate.lng)}
          offsetTop={-20}
          offsetLeft={-10}
        >
          <SiteSelectionMapPin size={25} />
        </Marker>
      </ReactMapGL>
    </div>
  );
};

export default SiteSelectionMap;
