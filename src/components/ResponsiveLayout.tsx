"use client";

import React, { useState, useEffect, ReactNode } from "react";

interface ResponsiveLayoutProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function ResponsiveLayout({
  children,
  fallback,
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return <>{isMobile ? fallback : children}</>;
}
