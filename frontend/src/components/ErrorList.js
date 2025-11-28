import React from 'react';

function ErrorList({ errors }) {
  if (!errors || errors.length === 0) {
    return <div className="no-errors">No errors found.</div>;
  }

  return (
    <ul className="error-list" aria-live="polite">
      {errors.map((error, idx) => (
        <li key={idx} className="error-item">
          <span className="error-message">{error.message}</span>
          {(error.line !== null && error.line !== undefined) && (
            <span className="error-location"> (Line: {error.line}, Column: {error.column})</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export default ErrorList;
