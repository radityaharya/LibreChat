import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useEffect } from 'react';

function createCodeSandboxFiles(messageContent: string) {
  // eslint-disable-next-line no-useless-escape
  const codeRegex = /```(\w+)\s*=\s*([\w\.\/]+)\s*\n([\s\S]+?)\n```/g;
  let match;
  const files = {};

  while ((match = codeRegex.exec(messageContent)) !== null) {
    // const language = match[1];
    const filename = match[2];
    const code = match[3];

    if (filename === 'package.json') {
      try {
        const parsed = JSON.parse(code);
        files[filename] = {
          content: { dependencies: parsed.dependencies || {} },
          // isBinary: false,
        };
      } catch (e) {
        console.error('Error parsing package.json:', e);
      }
    } else {
      files[filename] = {
        code,
      };
    }
  }

  return files;
}

function Sandpack(initFiles) {
  const { sandpack } = useSandpack();
  const { files, updateFile } = sandpack;

  useEffect(() => {
    Object.keys(initFiles).forEach((filename) => {
      const sandpackFile = sandpack.files[filename];
      const file = initFiles[filename];
      const code = file.content;

      if (!sandpackFile || !isEqual(sandpackFile.code, code) || sandpackFile.code.length === 0) {
        updateFile(filename, code, true);
      }
    });
  }, [initFiles, sandpack.files, updateFile]);

  return (
    <SandpackLayout
      style={{ height: '500px', '--sp-layout-height': '500px' } as React.CSSProperties}
    >
      <div className="flex w-full flex-col gap-2">
        {/* <SandpackCodeEditor
          showTabs
          showLineNumbers
          showInlineErrors
          wrapContent
          style={{ height:'500px' }}
        /> */}
        <SandpackPreview
          showRefreshButton
          showOpenInCodeSandbox={false}
          style={{ height: '500px' }}
        />
      </div>
    </SandpackLayout>
  );
}

function isEqual(code: string, code1: string) {
  return code === code1;
}

export { Sandpack, createCodeSandboxFiles };
