import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Saas labs App', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { "percentage.funded": 186, "amt.pledged": 15283 },
            { "percentage.funded": 92, "amt.pledged": 6000 },
            { "percentage.funded": 80, "amt.pledged": 5000 },
            { "percentage.funded": 150, "amt.pledged": 7500 },
            { "percentage.funded": 110, "amt.pledged": 10000 },
            { "percentage.funded": 95, "amt.pledged": 5800 },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders header correctly', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toHaveTextContent('SaaS Labs Assignment');
  });

  test('shows loading indicator initially', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  test('displays fetched projects in the table', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('186')).toBeInTheDocument();
      expect(screen.getByText('15283')).toBeInTheDocument();
    });
  });

  test('displays correct number of records per page', async () => {
    render(<App />);
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Includes header row
      expect(rows).toHaveLength(6);
    });
  });

  test('paginates correctly', async () => {
    render(<App />);
    await waitFor(() => {
      // Click 'Next' button
      const nextButton = screen.getByLabelText('Next Page');
      userEvent.click(nextButton);

      // Check for second-page data
      expect(screen.getByText('95')).toBeInTheDocument();
      expect(screen.getByText('5800')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch data');
    });
  });

});
