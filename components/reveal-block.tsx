"use client";

import { useEffect, useRef, useState } from "react";

type RevealBlockProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function RevealBlock({
  children,
  className = "",
  delay = 0
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-enter ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
