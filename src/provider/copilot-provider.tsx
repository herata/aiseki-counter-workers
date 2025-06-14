"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

interface CopilotProviderProps {
  children: React.ReactNode;
}

export function CopilotProvider({ children }: CopilotProviderProps) {
  return (
    <CopilotKit 
      runtimeUrl="/api/copilotkit" 
      showDevConsole={false}
    >
      {children}
      <CopilotPopup
        labels={{
          title: "相席カウンター AI アシスタント",
          initial: "こんにちは！相席カウンターのデータ分析をお手伝いします。\n\n「東京の新宿店の今日のデータを見せて」や「大阪府の昨日のデータを表示」などと話しかけてください。",
        }}
        clickOutsideToClose={true}
        defaultOpen={false}
        shortcut="Cmd+J"
      />
    </CopilotKit>
  );
}
