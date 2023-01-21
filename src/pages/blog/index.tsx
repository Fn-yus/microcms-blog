import Link from "next/link";

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CreateIcon from '@material-ui/icons/Create';

import { client } from "../../libs/sdk/client";

import styles from '../../styles/Home.module.scss';

import { formatUtcToJapanTimeZone } from '../../utils/date.js';
import { sortAllBlogs} from '../../utils/blog.js';

import { Data } from '../../interfaces'

export default function Home({ blogs }) {
  return (
    <>
      {blogs.map((blog) => (
        <Link href={`/blog/${blog.id}`}  key={blog.id} passHref>  
          <Card className={styles.blogCard} variant="outlined">
            <CardContent>
              <Typography className={styles.title} variant="h5" component="h2">{blog.title}</Typography>
              <Typography variant="body2" component="p">{blog.body.replace(/<[^>]+>/g, '')}</Typography>
              <Grid container justifyContent={"flex-end"} spacing={1} className={styles.timestampBox}>
                <Grid item><CreateIcon className={styles.svg} /></Grid>
                <Grid item><Typography className={styles.timestamp} component="p">{formatUtcToJapanTimeZone(blog.publishedAt)}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}

// データをテンプレートに受け渡す処理
export const getStaticProps = async () => {
  const blogs: Data = await client.get({ endpoint: "blog" });

  return {
    props: {
      blogs: sortAllBlogs(blogs)
    },
    revalidate: 5,
  };
};