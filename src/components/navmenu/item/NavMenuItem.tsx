// Component styles
import styles from './NavMenuItem.module.scss';
// Next components
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function NavMenuItem(props: { item: string, slug: string, img: string }) {
    const { item, slug, img } = props;
    const imagePath = require(`/public/images/ui/${img}`);
    const router = useRouter();

    return (
        <button className={(router.pathname === slug) ? [styles.NavMenuItem, styles.active].join(' ') : styles.NavMenuItem}>
            <span>{item}</span>
            <Image 
                alt={item} 
                src={imagePath} 
                width='48' 
                height='48' />
        </button>
    );
}