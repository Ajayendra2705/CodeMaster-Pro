import Editor from '@monaco-editor/react';
import { useState } from 'react';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [language, setLanguage] = useState('cpp');

  return (
    <div className="code-editor-container">
      <div className="toolbar">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      
      <Editor
        height="60vh"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          roundedSelection: false,
          padding: { top: 10 },
        }}
      />
    </div>
  );
}
