import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface JSONHighlighterProps {
  json: string;
}

const JSONHighlighter: React.FC<JSONHighlighterProps> = ({ json }) => {
  return (
    <SyntaxHighlighter language="json" showLineNumbers={true} style={vs}>
      {json}
    </SyntaxHighlighter>
  );
};

export default JSONHighlighter;
