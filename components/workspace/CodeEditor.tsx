"use client";

import { useEffect, useState } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { dracula } from "@codesandbox/sandpack-themes";
import type { FileData, StatusStep } from "@/types/workspace";
import { CodeEditorInner } from "./CodeEditorInner";

type ActiveTab = "preview" | "code";

export const PLACEHOLDER_FILES_BY_TEMPLATE: Record<string, Record<string, { code: string }>> = {
  react: {
    "/App.js": {
      code: `export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <p style={{ fontSize: 14 }}>Your React app will appear here</p>
      </div>
    </div>
  );
}`,
    },
  },
  vue: {
    "/src/App.vue": {
      code: `<template>
  <div style="min-height: 100vh; background: #0a0a0a; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif;">
    <div style="text-align: center; color: rgba(255,255,255,0.3);">
      <div style="font-size: 40px; margin-bottom: 16px;">⚡</div>
      <p style="font-size: 14px;">Your Vue app will appear here</p>
    </div>
  </div>
</template>

<script setup>
// Vue Composition API code will go here
</script>`,
    },
    "/src/main.js": {
      code: `import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');`
    }
  },
  svelte: {
    "/App.svelte": {
      code: `<div style="min-height: 100vh; background: #0a0a0a; display: flex; align-items: center; justify-content: center; font-family: system-ui, sans-serif;">
  <div style="text-align: center; color: rgba(255,255,255,0.3);">
    <div style="font-size: 40px; margin-bottom: 16px;">⚡</div>
    <p style="font-size: 14px;">Your Svelte app will appear here</p>
  </div>
</div>

<script>
// Svelte logic will go here
</script>`,
    },
  },
  static: {
    "/index.html": {
      code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Static App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
    }
  </style>
</head>
<body>
  <div style="text-align: center; color: rgba(255,255,255,0.3);">
    <div style="font-size: 40px; margin-bottom: 16px;">⚡</div>
    <p style="font-size: 14px;">Your Static HTML app will appear here</p>
  </div>
  <script src="/index.js"></script>
</body>
</html>`,
    },
    "/index.js": {
      code: `// JS logic here`
    }
  },
};

export const BASE_DEPENDENCIES: Record<string, string> = {
  "react-is": "latest",
  "react-router-dom": "latest",
  "lucide-react": "latest",
  recharts: "latest",
  "date-fns": "latest",
  "framer-motion": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  zod: "latest",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-tooltip": "latest",
  "@radix-ui/react-accordion": "latest",
  "@radix-ui/react-select": "latest",
  axios: "latest",
  clsx: "latest",
  "class-variance-authority": "latest",
  "tailwind-merge": "latest",
};

interface CodeEditorProps {
  fileData: FileData | null;
  isGenerating: boolean;
  statusLog: StatusStep[];
  onImprove: (userRequest: string) => Promise<void>;
  onFixError: (error: string) => Promise<void>;
  onFilePatch: (patches: FileData) => void;
  appTitle: string | null;
  isImproving: boolean;
  isProUser: boolean;
  initialTemplate?: string;
}

export function CodeEditor({
  fileData,
  isGenerating,
  statusLog,
  onImprove,
  onFixError,
  onFilePatch: _onFilePatch,
  appTitle,
  isImproving,
  isProUser,
  initialTemplate,
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");

  useEffect(() => {
    if (fileData) setActiveTab("preview");
  }, [fileData]);

  const template = fileData?.template || initialTemplate || "react";
  const placeholderFiles = PLACEHOLDER_FILES_BY_TEMPLATE[template] || PLACEHOLDER_FILES_BY_TEMPLATE.react;
  const files = fileData?.files ?? placeholderFiles;
  const dependencies = {
    ...BASE_DEPENDENCIES,
    ...(fileData?.dependencies ?? {}),
  };

  const filePathKey = Object.keys(files).sort().join("|");
  const providerKey = `${template}-${filePathKey}`;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <SandpackProvider
        key={providerKey}
        template={template as any}
        theme={dracula}
        files={files}
        customSetup={{ dependencies }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          recompileMode: "delayed",
          recompileDelay: 500,
        }}
      >
        <CodeEditorInner
          isGenerating={isGenerating}
          statusLog={statusLog}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onImprove={onImprove}
          onFixError={onFixError}
          fileData={fileData}
          appTitle={appTitle}
          isImproving={isImproving}
          isProUser={isProUser}
          initialTemplate={initialTemplate}
        />
      </SandpackProvider>
    </div>
  );
}
