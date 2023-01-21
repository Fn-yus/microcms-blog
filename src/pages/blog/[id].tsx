import { Grid } from '@material-ui/core';
import Link from "next/link";

import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';

import { client } from '../../libs/sdk/client';
import styles from '../../styles/Home.module.scss';
import { formatUtcToJapanTimeZone } from '../../utils/date.js';
import { sortAllBlogs } from '../../utils/blog.js';

import { Data } from '../../interfaces'

export default function Blog({ targetBlog, backPageBlogId, nextPageBlogId }) {
  const publishedAt = formatUtcToJapanTimeZone(targetBlog.publishedAt);
  const revisedAt = formatUtcToJapanTimeZone(targetBlog.revisedAt);
  return (
    <>
      <h1 className={styles.title}>{targetBlog.title}</h1>
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
      <div dangerouslySetInnerHTML={{__html: `${targetBlog.body}`,}} className={styles.post} />

      <div className={styles.footer}>
        {
          <Link href={`/blog/${backPageBlogId}`} passHref>
            <div className={`${!!backPageBlogId ? styles.footerHoverArea : styles.hiddenfooterHoverArea}`}>
              <ChevronLeftIcon className={styles.chevronIcon} />
            </div>
          </Link>
        }
        <Link href="/" passHref>
          <div className={styles.footerHoverArea}>
            <HomeIcon className={styles.homeIcon} />
          </div>
        </Link>
        
        {
          <Link href={`/blog/${nextPageBlogId}`} passHref>
            <div className={`${!!nextPageBlogId ? styles.footerHoverArea : styles.hiddenfooterHoverArea}`}>
              <ChevronRightIcon className={styles.chevronIcon} />
            </div>
          </Link>
        }
      </div>
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
  const targetBlogId = context.params.id;

  const blogs: Data = await client.get({endpoint: "blog"});
  const targetBlog = await client.get({ endpoint: "blog", contentId: targetBlogId });

  const blogIds = sortAllBlogs(blogs).map((blog) => {return blog.id});

  const targetBlogIndex = blogIds.indexOf(targetBlogId);
  const backPageBlogId = targetBlogIndex !== 0 ? blogIds[targetBlogIndex - 1] : null;
  const nextPageBlogId = targetBlogIndex !== blogIds.length -1 ? blogIds[targetBlogIndex + 1] : null;
 
  console.log(blogIds, targetBlogIndex, backPageBlogId, nextPageBlogId)
  return {
    props: {
      targetBlog: targetBlog,
      backPageBlogId: backPageBlogId,
      nextPageBlogId: nextPageBlogId,
    },
    revalidate: 5
  };
};