'use client';
import DonutScene from "./components/Scene/DonutScene";
import styles from './style/page.module.css'
import { useRef, useEffect } from 'react'

interface ProfileContentProps {
    loader: React.RefObject<HTMLDivElement | null>;
    path: React.RefObject<SVGPathElement | null>;
}

function ProfileContent({ loader, path }: ProfileContentProps) {
    return (
        <main className={styles.main}>
            <div className={styles.body}>
                <DonutScene name={'Hello World !!'} />
            </div>
            <div ref={loader} className={`${styles.loader} z-10`}>
                <svg>
                    <path ref={path} fill="white"></path>
                </svg>
            </div>
        </main>
    );
}

export default function Home() {
    const loader = useRef<HTMLDivElement | null>(null);
    const path = useRef<SVGPathElement | null>(null);

    const initialCurve = 300;
    const duration = 1000;
    let start: number;

    useEffect(() => {
        setPath(initialCurve)
        setTimeout(() => {
            requestAnimationFrame(animate)
        },)
    }, [])

    const animate = (timestamp: number) => {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;
        const currentCurve = easeOutQuad(elapsed, initialCurve, -initialCurve, duration);
        setPath(Math.max(currentCurve, 0));
        if (loader.current) {
            loader.current.style.top =
                easeOutQuad(elapsed, 0, -loaderHeight(), duration) + "px";
        }
        if (elapsed < duration) {
            requestAnimationFrame(animate);
        }
    };

    const easeOutQuad = (time: number, start: number, end: number, duration: number) => {
        return -end * (time /= duration) * (time - 2) + start;
    }

    const loaderHeight = (): number => {
        const loaderBounds = loader.current?.getBoundingClientRect();
        return loaderBounds?.height || 0;
    }

    const setPath = (curve: number) => {
        const width = window.innerWidth
        const height = loaderHeight();
        path.current?.setAttributeNS(null, "d",
            `M0 0
            L${width} 0
            L${width} ${height}
            Q${width / 2} ${height - curve} 0 ${height}
            L0 0`
        )
    }

    return (
        <>
            <ProfileContent loader={loader} path={path} />
        </>
    );
}