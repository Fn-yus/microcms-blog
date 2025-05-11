'use client';

import { useEffect, useRef, ChangeEvent, useState } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { gpx }  from '@mapbox/togeojson';

import styles from '../../styles/Home.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const initialPitch = 45;
  const initialBearing = -17.6;
  const [pitch, setPitch] = useState(initialPitch);
  const [bearing, setBearing] = useState(initialBearing);

  const handlePitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPitch = parseFloat(event.target.value);
    setPitch(newPitch);
    if (mapRef.current) {
      mapRef.current.setPitch(newPitch);
    }
  };

  const handleBearingChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newBearing = parseFloat(event.target.value);
    setBearing(newBearing);
    if (mapRef.current) {
      mapRef.current.setBearing(newBearing);
    }
  };

  const handleResetView = () => {
    setPitch(initialPitch);
    setBearing(initialBearing);
    if (mapRef.current) {
      mapRef.current.setPitch(initialPitch);
      mapRef.current.setBearing(initialBearing);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !mapRef.current) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const gpxData = e.target?.result as string;
        if (!gpxData) return;

        const domParser = new DOMParser();
        const gpxDoc = domParser.parseFromString(gpxData, 'text/xml');
        const geojsonData = (gpx as (doc: Document) => GeoJSON.FeatureCollection)(gpxDoc);


        const map = mapRef.current;
        if (!map) return;

        const source = map.getSource('gpx-data') as GeoJSONSource;
        if (source) {
          source.setData(geojsonData);
        } else {
          map.addSource('gpx-data', {
            type: 'geojson',
            data: geojsonData,
          });
          map.addLayer({
            id: 'gpx-layer',
            type: 'line',
            source: 'gpx-data',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#ff0000', // Red color for the GPX track
              'line-width': 3,
            },
          });
        }

        // Fit map to GPX bounds
        if (geojsonData.features.length > 0) {
          const coordinates = geojsonData.features.flatMap(feature =>
            (feature.geometry as GeoJSON.LineString).coordinates // Assuming LineString
          );
          if (coordinates.length > 0) {
            const bounds = coordinates.reduce((currentBounds, coord) => {
              return currentBounds.extend(coord as [number, number]);
            }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));
            map.fitBounds(bounds, {
              padding: 50,
              pitch: map.getPitch(),
              bearing: map.getBearing(),
            });
          }
        }

      } catch (error) {
        console.error('Error processing GPX file:', error);
        alert('GPXファイルの処理中にエラーが発生しました。');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Initialize map only once

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', //地図のスタイルを指定
      center: [139.6917, 35.6895], // 東京
      zoom: 10,
      pitch: initialPitch,
      bearing: initialBearing,
    });
    mapRef.current = map;

    // Update sliders if map pitch/bearing changes via other controls (e.g., navigation control)
    map.on('pitch', () => {
      if (mapRef.current) {
        setPitch(mapRef.current.getPitch());
      }
    });
    map.on('rotate', () => {
      if (mapRef.current) {
        setBearing(mapRef.current.getBearing());
      }
    });

    const language = new MapboxLanguage({
      defaultLanguage: 'ja', // デフォルトの言語を日本語に設定
    });
    map.addControl(language); // 地図に言語コントロールを追加
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 2 });
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });

      // ヒルシェード（陰影起伏図）レイヤーを追加
      map.addLayer({
        id: 'hillshade',
        type: 'hillshade',
        source: 'mapbox-dem',
        paint: {
          'hillshade-illumination-direction': 335,
          'hillshade-illumination-anchor': 'viewport',
          'hillshade-shadow-color': '#223b6e',
          'hillshade-highlight-color': '#f0eae2',
          'hillshade-exaggeration': 0.5
        }
      });

      // 等高線レイヤーを追加
      map.addSource('contour', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2'
      });
      map.addLayer({
        id: 'contour-lines',
        type: 'line',
        source: 'contour',
        'source-layer': 'contour',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#877b59',
          'line-width': [
            'interpolate',
            ['exponential', 1.5],
            ['zoom'],
            0, 0.3,
            12, 1.5
          ],
          'line-opacity': 0.5
        }
      }, 'sky');

    });

    // No need to return map.remove() here if we are managing the map instance with mapRef
    // and want to keep it for GPX updates.
    // However, if the component unmounts, we should clean up.

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className={styles.mapWrapper}>
      <div
        style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          zIndex: 1,
          backgroundColor: 'rgba(250, 250, 250, 0.9)',
          padding: '12px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '250px', // Slightly narrower
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: '13px'
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <input type="file" accept=".gpx" onChange={handleFileChange} style={{ width: '100%' }}/>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="pitch" style={{ display: 'block', marginBottom: '4px', color: '#555' }}>
            Pitch: {pitch.toFixed(1)}°
          </label>
          <input
            id="pitch"
            type="range"
            min="0"
            max="85"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
            style={{ width: '100%', accentColor: '#007bff' }}
          />
        </div>

        <div>
          <label htmlFor="bearing" style={{ display: 'block', marginBottom: '4px', color: '#555' }}>
            Bearing: {bearing.toFixed(1)}°
          </label>
          <input
            id="bearing"
            type="range"
            min="-180"
            max="180"
            step="0.1"
            value={bearing}
            onChange={handleBearingChange}
            style={{ width: '100%', accentColor: '#007bff' }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={handleResetView}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Reset View
          </button>
        </div>
      </div>
      <div ref={mapContainerRef} className={styles.mapContainer}/>
    </div>
  )
}
