import React, { useState } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import ErrorList from './components/ErrorList';
import Instructions from './components/Instructions';

function App() {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setErrors([]);
    setApiError(null);
    try {
      const response = await axios.post('/api/analyze', { code });
      if (response.data && Array.isArray(response.data.errors)) {
        setErrors(response.data.errors);
      } else {
        setApiError('Unexpected response from server');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setApiError('Failed to analyze code. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>JavaScript Debugger</h1>
      </header>
      <main>
        <section className="editor-section">
          <Instructions />
          <CodeEditor value={code} onChange={(newCode) => setCode(newCode)} />
          <button className="analyze-button" onClick={handleAnalyze} disabled={loading || !code.trim()}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </section>
        <section className="errors-section">
          <h2>Errors</h2>
          {apiError && <div className="api-error">{apiError}</div>}
          <ErrorList errors={errors} />
        </section>
      </main>
      <footer>
        <small>© 2024 JavaScript Debugger</small>
      </footer>
    </div>
  );
}

export default App;
