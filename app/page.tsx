'use client';
import DonutScene from "./components/Scene/DonutScene";
import styles from './style/page.module.css'
import { useRef, useEffect, useState } from 'react'

interface ProfileContentProps {
    loader: React.RefObject<HTMLDivElement | null>;
    path: React.RefObject<SVGPathElement | null>;
    isLoaded: number;
}

function ProfileContent({ loader, path, isLoaded }: ProfileContentProps) {
    return (
        <main className={styles.main}>
            <div
                className={styles.body}
                style={{ opacity: isLoaded }}
            >
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
    const [isLoaded, setIsLoaded] = useState(0);

    const initialCurve = 200;
    const duration = 1500;
    let start: number;

    useEffect(() => {
        setPath(initialCurve)
        setTimeout(() => {
            requestAnimationFrame(animate)
        }, 100)
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
        const transitionProgress = Math.min(elapsed / duration, 1);
        setIsLoaded(transitionProgress);

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
            <ProfileContent loader={loader} path={path} isLoaded={isLoaded}/>
        </>
    );
}