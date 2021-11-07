import { Title } from "@material-ui/icons";
import styles from '../styles/Home.module.scss';


export default function title() {
    return (
        <Title className={styles.title}>
            日記みたいなもの
        </Title>
    );
}