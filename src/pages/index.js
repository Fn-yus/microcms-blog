import Link from "next/link";
import Card from 'react-bootstrap/Card';
import styles from '../styles/Home.module.scss';


export default function Home() {
  return (
    <Link href='/blog/' passHref>     
      <Card className={styles.card}>
        <Card.Title className={styles.cardTitle}>Blog</Card.Title>   
      </Card>
    </Link>
  );
}