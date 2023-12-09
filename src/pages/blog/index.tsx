import Link from "next/link";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CreateIcon from '@mui/icons-material/Create';

// import { client } from "../../libs/sdk/client";

import styles from '../../styles/Home.module.scss';

import { formatUtcToJapanTimeZone } from '../../utils/date.js';
import { sortAllBlogs} from '../../utils/blog.js';

// import { Data } from '../../interfaces'

export default function Home({ blogs }) {
  return <>
    {blogs.map((blog) => (
      <Link href={`/blog/${blog.id}`} key={blog.id} passHref legacyBehavior>  
        <Card className={styles.blogCard} variant="outlined">
          <CardContent>
            <Typography className={styles.title} variant="h5" component="h2">{blog.title}</Typography>
            <Typography variant="body2" component="p">{blog.body.replace(/<[^>]+>/g, '')}</Typography>
            <Grid container justifyContent={"flex-end"} spacing={1} className={styles.timestampBox}>
              <Grid item><CreateIcon className={styles.svg} /></Grid>
              <Grid item><Typography className={styles.timestamp} component="p">{formatUtcToJapanTimeZone(blog.createdAt)}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Link>
    ))}
  </>;
}

// データをテンプレートに受け渡す処理
export const getStaticProps = async () => {
  const blogs = await fetch(`${process.env.API_BASE_URL}/api/blogs`).then((res) => res.json());

  return {
    props: {
      blogs: sortAllBlogs(blogs)
    },
    revalidate: 5,
  };
};