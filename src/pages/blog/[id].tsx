import { client } from '../../libs/sdk/client';
import styles from '../../styles/Home.module.scss';
import { formatUtcToJapanTimeZone } from '../../utils/date.js';
import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
import { Grid } from '@material-ui/core';

export default function Blog({ blog }) {
  const publishedAt = formatUtcToJapanTimeZone(blog.publishedAt);
  const revisedAt = formatUtcToJapanTimeZone(blog.revisedAt);
  return (
    <>
      <h1 className={styles.title}>{blog.title}</h1>
        <>
          <Grid container justifyContent={"flex-end"} spacing={1}>
            <Grid item><CreateIcon className={styles.svg} /></Grid>
            <Grid item><p className={styles.timestamp}>{publishedAt}</p></Grid>
          </Grid>
          {
            publishedAt !== revisedAt &&
            <Grid container justifyContent={"flex-end"} spacing={1}>
              <Grid item><UpdateIcon className={styles.svg} /></Grid>
              <Grid item><p className={styles.timestamp}>{revisedAt}</p></Grid>
            </Grid>
          }
        </>
      <div dangerouslySetInnerHTML={{__html: `${blog.body}`,}} className={styles.post} />
    </>
  );
}

// 静的生成のためのパスを指定
export const getStaticPaths = async () => {
  const paths = [];
  return { paths, fallback: 'blocking' };
};

// データをテンプレートに受け渡す部分の処理
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
    revalidate: 5
  };
};