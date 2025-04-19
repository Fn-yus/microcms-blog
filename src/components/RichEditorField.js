import Image from 'next/image'
import parse, { Element } from 'html-react-parser';

import styles from '../styles/Home.module.scss'

export const RichEditorField = (content) => {
  return (!content) ? null : <div className={styles.post} lang='ja'>{parse(content, { replace })}</div>;
};

const replace = (domNode) => {
  if (!(domNode instanceof Element)) return;

  if (domNode.name === "img") {
    const { attribs } = domNode;

    return (
      <Image
        src={attribs.src}
        width={1600}
        height={1000}
        alt={attribs.alt ? attribs.alt : "Image"}
        priority={true}
        loading="eager"
        sizes="100vw"
        style={{ width: '100%', height: 'auto', }}
      />
    );
  }
};
