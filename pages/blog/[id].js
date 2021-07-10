import { client } from '../../libs/client';
import styles from '../../styles/Home.module.scss';
import { formatUtcToJapanTimeZone } from '../../variables/date.js';

export default function BlogId({ blog }) {
  const publishedAt = formatUtcToJapanTimeZone(blog.publishedAt);
  console.log(blog.publishedAt)
  console.log(publishedAt)
  const revisedAt = formatUtcToJapanTimeZone(blog.revisedAt);
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{blog.title}</h1>
        {
          blog.publishedAt === blog.revisedAt ? 
          <p className={styles.timestamp}>作成 {publishedAt}</p> : 
          <div><p>作成 {publishedAt} </p><p className={styles.timestamp}>更新 {revisedAt}</p></div>
        }
      <div
        dangerouslySetInnerHTML={{
          __html: `${blog.body}`,
        }}
        className={styles.post}
      />
    </main>
  );
}

// 静的生成のためのパスを指定
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};