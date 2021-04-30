import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './Map.css';
import { showDataOnMap } from './util';

function Map({countries, casesType, center, zoom}) {

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  // console.log(countries.country)
  // console.log(casesType)
  // console.log(typeof casesType)

  return (
    <div className="map">
      <MapContainer>
        <ChangeView center={center} zoom={zoom}/>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  )
}

export default Map
