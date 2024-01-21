import { Grid } from '@mui/material';
import Link from "next/link";

import CreateIcon from '@mui/icons-material/Create';
import UpdateIcon from '@mui/icons-material/Update';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';

import { client } from '../../libs/sdk/client';
import styles from '../../styles/Home.module.scss';
import { formatUtcToJapanTimeZone } from '../../utils/date.js';
import { sortAllBlogs } from '../../utils/blog.js';
import { RichEditorField } from '../../components/RichEditorField';
import { currentUrl } from "../../utils/url";
import { RichEditorField } from '../../components/RichEditorField';

// import { Data } from '../../interfaces'

export default function Blog({ blogs, targetBlogId }) {
  
  const targetBlog = blogs.find((blog) => blog.id === targetBlogId);
  const blogIds = blogs.map((blog) => {return blog.id});

  const targetBlogIndex = blogIds.indexOf(targetBlogId);
  const backPageBlogId = targetBlogIndex !== 0 ? blogIds[targetBlogIndex - 1] : null;
  const nextPageBlogId = targetBlogIndex !== blogIds.length -1 ? blogIds[targetBlogIndex + 1] : null;

  const createdAt = formatUtcToJapanTimeZone(targetBlog.createdAt);
  const updatedAt = formatUtcToJapanTimeZone(targetBlog.updatedAt);

  return <>
    <h1 className={styles.title}>{targetBlog.title}</h1>
      <>
        <Grid container justifyContent={"flex-end"} spacing={1}>
          <Grid item><CreateIcon className={styles.svg} /></Grid>
          <Grid item><p className={styles.timestamp}>{createdAt}</p></Grid>
        </Grid>
        {
          createdAt !== updatedAt &&
          <Grid container justifyContent={"flex-end"} spacing={1}>
            <Grid item><UpdateIcon className={styles.svg} /></Grid>
            <Grid item><p className={styles.timestamp}>{updatedAt}</p></Grid>
          </Grid>
        }
      </>

    {RichEditorField(targetBlog.body)}

    <div className={styles.footer}>
      {
        <Link href={`/blog/${backPageBlogId}`} passHref legacyBehavior>
          <div className={`${!!backPageBlogId ? styles.footerHoverArea : styles.hiddenfooterHoverArea}`}>
            <ChevronLeftIcon className={styles.chevronIcon} />
          </div>
        </Link>
      }
      <Link href="/" passHref legacyBehavior>
        <div className={styles.footerHoverArea}>
          <HomeIcon className={styles.homeIcon} />
        </div>
      </Link>
      
      {
        <Link href={`/blog/${nextPageBlogId}`} passHref legacyBehavior>
          <div className={`${!!nextPageBlogId ? styles.footerHoverArea : styles.hiddenfooterHoverArea}`}>
            <ChevronRightIcon className={styles.chevronIcon} />
          </div>
        </Link>
      }
    </div>
  </>;
}

// 静的生成のためのパスを指定
export const getStaticPaths = async () => {
  const paths = [];
  return { paths, fallback: 'blocking' };
};

// データをテンプレートに受け渡す部分の処理
export const getStaticProps = async (context) => {
  const blogs = await fetch(`${currentUrl}/api/blogs`).then((res) => res.json());

  return {
    props: {
     blogs: sortAllBlogs(blogs),
     targetBlogId: context.params.id,
    },
    revalidate: 5
  };
};