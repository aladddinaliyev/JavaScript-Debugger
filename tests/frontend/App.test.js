
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../../frontend/src/App';

jest.mock('axios');

describe('App component', () => {
  beforeEach(() => {
    axios.post.mockReset();
  });

  it('renders header and instructions', () => {
    render(<App />);
    expect(screen.getByText(/JavaScript Debugger/i)).toBeInTheDocument();
    expect(screen.getByText(/How to Use/i)).toBeInTheDocument();
  });

  it('allows code input and enables Analyze button', () => {
    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Analyze/i });

    expect(button).toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'const a = 1;' } });
    expect(button).toBeEnabled();
  });

  it('calls API and displays errors after Analyze', async () => {
    const mockErrors = [
      { message: 'Unexpected token', line: 1, column: 7 },
      { message: 'Unmatched opening bracket', line: 2, column: 10 }
    ];
    axios.post.mockResolvedValue({ data: { errors: mockErrors } });

    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Analyze/i });

    fireEvent.change(textarea, { target: { value: 'const a = ;' } });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/analyze', { code: 'const a = ;' });
    });

    mockErrors.forEach(err => {
      expect(screen.getByText(err.message)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`Line: ${err.line}, Column: ${err.column}`))).toBeInTheDocument();
    });
  });

  it('displays no errors message when no errors returned', async () => {
    axios.post.mockResolvedValue({ data: { errors: [] } });

    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Analyze/i });

    fireEvent.change(textarea, { target: { value: 'const a = 1;' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/No errors found/i)).toBeInTheDocument();
    });
  });

  it('displays API error if request fails', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));

    render(<App />);
    const textarea = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Analyze/i });

    fireEvent.change(textarea, { target: { value: 'const a = 1;' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to analyze code/i)).toBeInTheDocument();
    });
  });
});
