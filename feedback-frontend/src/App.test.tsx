import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Feedback form', () => {
    render(<App />);
    const linkElement = screen.getByText(/Feedback Form/i);
    expect(linkElement).toBeInTheDocument();
});
