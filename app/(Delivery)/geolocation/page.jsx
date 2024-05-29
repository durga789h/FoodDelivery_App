"use client"
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const deliveryPoints = [
  { id: 1, lon: 85.1376, lat: 25.5941, name: 'Patna' },
  { id: 2, lon: 85.7898, lat: 25.8596, name: 'Samastipur' },
  { id: 3, lon: 85.3096, lat: 23.3441, name: 'Ranchi' },
  { id: 4, lon: 75.7873, lat: 26.9124, name: 'Jaipur' },
  { id: 5, lon: 73.0243, lat: 26.2389, name: 'Jodhpur' },
  { id: 6, lon: 85.3240, lat: 27.7172, name: 'Kathmandu' }, // Nepal's capital Kathmandu
  { id: 7, lon: 77.4126, lat: 23.2599, name: 'Bhopal' },
  { id: 8, lon: 88.3639, lat: 22.5726, name: 'Kolkata' },
];

const OpenLayersMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const vectorSource = new VectorSource();

    deliveryPoints.forEach(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([point.lon, point.lat])),
        name: point.name,
      });

      feature.setStyle(new Style({
        image: new Icon({
          color: '#BADA55',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/latest/examples/data/dot.png',
        }),
        text: new Text({
          text: point.name,
          offsetY: -25,
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
      }));

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([85.1376, 25.5941]), // Center the map at Patna
        zoom: 5,
      }),
    });

    return () => map.setTarget(null);
  }, []);

  return<>
  <h1 className='text-center text-xl text-fuchsia-600'>Delivery points</h1>
   <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>;
  </>
};

export default OpenLayersMap;
