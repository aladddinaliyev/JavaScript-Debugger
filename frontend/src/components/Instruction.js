import React from 'react';

function Instructions() {
  return (
    <section className="instructions" aria-label="Usage instructions">
      <h2>How to Use</h2>
      <ol>
        <li>Paste or type your JavaScript code into the editor.</li>
        <li>Click the <strong>Analyze</strong> button to check your code.</li>
        <li>Review any syntax or bracket errors reported below with line and column details.</li>
        <li>Fix the errors in your code and analyze again as needed.</li>
      </ol>
      <p>
        You can also upload your code by pasting it or typing directly. The editor supports syntax highlighting and bracket matching for easier debugging.
      </p>
      <p>
        If you encounter unexpected issues, ensure your code is valid JavaScript and try again.
      </p>
    </section>
  );
}

export default Instructions;
