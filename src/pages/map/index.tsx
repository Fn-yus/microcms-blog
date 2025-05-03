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
    });

    const language = new MapboxLanguage({
      defaultLanguage: 'ja', // デフォルトの言語を日本語に設定
    });
    map.addControl(language); // 地図に言語コントロールを追加

    return () => map.remove(); // クリーンアップ（メモリリーク防止）
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainerRef} className={styles.mapContainer}/>
    </div>
  )
}