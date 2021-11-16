import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from './Link';
import styles from '../styles/Home.module.scss';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" className={styles.copyright}>
      {'Copyright © '}
      <Link color="inherit" href="https://fn-yus.vercel.app/">
        雑な文章、雑文
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}