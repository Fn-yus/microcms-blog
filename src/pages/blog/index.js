import Link from "next/link";
import Card from 'react-bootstrap/Card';
import { Row, Col } from "react-bootstrap";
import { client } from "../../libs/sdk/client";
import styles from '../../styles/Home.module.scss';

export default function Home({ blog }) {
  return (
    <Row xs={1} lg={2}>
      {blog.map((blog) => (
        <Col key={blog.id} className={styles.col}>
          <Link href={`/blog/${blog.id}`}  passHref>  
            <Card className={styles.card}>
              <Card.Body>
                <Card.Title className={styles.cardTitle}>{blog.title}</Card.Title>   
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
      {
        blog.length % 2 === 1 && <Col style={{visibility: 'hidden'}} /> // ブログの数が奇数の場合はレイアウトを整える
      }
    </Row>
  );
}

// データをテンプレートに受け渡す処理
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blog" });

  return {
    props: {
      blog: data.contents,
    },
    revalidate: 5,
  };
};