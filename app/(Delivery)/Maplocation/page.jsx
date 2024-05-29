"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import 'ol/ol.css';

const OpenLayersMap = dynamic(() => import('../../_components/OpenLayersMap'), {
  ssr: false, // This line disables server-side rendering for this component
});

const page = () => {
  return (
    <div>
      <h1>My Map Page</h1>
      <OpenLayersMap />
    </div>
  );
};

export default page;
