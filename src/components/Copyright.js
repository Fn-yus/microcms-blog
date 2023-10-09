import React from 'react';
import Typography from '@mui/material/Typography';
import Link from './Link';
import styles from '../styles/Home.module.scss';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" className={styles.copyright}>
      {'Copyright © '}
      <Link color="inherit" href="https://fn-yus.vercel.app/">
        Jikba
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}