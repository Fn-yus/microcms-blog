import Link from "next/link";
import Image from 'next/image'
import Typography from '@material-ui/core/Typography';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Link href='/blog/' passHref>
        <Typography className={`${styles.title} ${styles.linkTitle}`}>Blog</Typography>
      </Link>
      <Image src="/topImg.jpg" width={1600} height={1000} objectFit="contain" priority={true} loading="eager" alt="初冠雪直後の白山の風景" />
      <p className={styles.caption}>2020/10/16 初冠雪の白山</p>
    </>
  );
}