import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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

const OpenLayersMap = ({ orders = [] }) => {
  const mapContainerRef = useRef(null);

  const getCoordinates = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error(`Coordinates not found for city: ${city}`);
    }
  };

  useEffect(() => {
    const vectorSource = new VectorSource();

    const fetchCoordinatesAndAddFeatures = async () => {
      for (const order of orders) {
        try {
          const { lat, lon } = await getCoordinates(order.data.city);
          const feature = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            name: order.data.name,
          });

          feature.setStyle(new Style({
            image: new Icon({
              color: '#BADA55',
              crossOrigin: 'anonymous',
              src: 'https://openlayers.org/en/latest/examples/data/dot.png',
            }),
            text: new Text({
              text: order.data.name,
              offsetY: -25,
              fill: new Fill({ color: '#000' }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
          }));

          vectorSource.addFeature(feature);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchCoordinatesAndAddFeatures();

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
  }, [orders]);

  return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>;
};

OpenLayersMap.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({
      city: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
};

export default OpenLayersMap;
