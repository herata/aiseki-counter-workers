"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// CopilotProviderを動的インポートしてSSRを無効化
const CopilotProvider = dynamic(
  () => import("./copilot-provider").then((mod) => ({ default: mod.CopilotProvider })),
  { 
    ssr: false,
    loading: () => null, // ローディング中は何も表示しない
  }
);

interface CopilotWrapperProps {
  children: ReactNode;
}

export function CopilotWrapper({ children }: CopilotWrapperProps) {
  return <CopilotProvider>{children}</CopilotProvider>;
}
