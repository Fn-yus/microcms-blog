import Link from "../components/Link";

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href='/blog/'>
            <a>ブログ</a>
          </Link>
        </li>
      </ul>
    </div>
  );
}