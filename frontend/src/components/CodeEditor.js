import React from 'react';
import { Controlled as ControlledCodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/edit/matchbrackets.js';

function CodeEditor({ value, onChange }) {
  return (
    <ControlledCodeMirror
      value={value}
      options={{
        mode: 'javascript',
        theme: 'eclipse',
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 2,
        indentUnit: 2,
        autofocus: true,
        lint: false,
        scrollbarStyle: null
      }}
      onBeforeChange={(_editor, _data, value) => {
        onChange(value);
      }}
      onChange={() => {}}
    />
  );
}

export default CodeEditor;
