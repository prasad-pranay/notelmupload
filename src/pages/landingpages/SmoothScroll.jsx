
import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import "lenis/dist/lenis.css";

function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        function update({ timestamp }) {
            lenisRef.current?.lenis?.raf(timestamp);
        }

        frame.setup(update, true);

        return () => {
            cancelFrame(update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            options={{
                autoRaf: false,
                lerp: 0.08,
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1,
            }}
        >
            {children}
        </ReactLenis>
    );
}

export default SmoothScroll;
