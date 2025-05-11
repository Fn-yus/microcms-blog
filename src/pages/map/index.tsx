'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

import styles from '../../styles/Home.module.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function Home() {
  // Mapboxの地図を表示するためのコンテナを参照するためのuseRefフック
  // useRefはコンポーネントのライフサイクルに依存しない参照を作成するために使用される
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // useEffectフックを使用して、コンポーネントがマウントされたときに地図を初期化する
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', //地図のスタイルを指定
      center: [139.6917, 35.6895], // 東京
      zoom: 10,
      pitch: 45,
      bearing: -17.6,
    });

    const language = new MapboxLanguage({
      defaultLanguage: 'ja', // デフォルトの言語を日本語に設定
    });
    map.addControl(language); // 地図に言語コントロールを追加

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

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => map.remove(); // クリーンアップ（メモリリーク防止）
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainerRef} className={styles.mapContainer}/>
    </div>
  )
}