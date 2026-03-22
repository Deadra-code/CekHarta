import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { useStore } from '../store/useStore';

// Mock the store
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harusnya merender total valuasi dengan benar', () => {
    const mockAssets = [
      { id: '1', name: 'Aset 1', valuation: 1000000, category: 'Real Estat', status: 'Siap', checklist: [] },
      { id: '2', name: 'Aset 2', valuation: 2000000, category: 'Finansial', status: 'Siap', checklist: [] }
    ];

    (useStore as any).mockReturnValue({
      assets: mockAssets,
      activities: []
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Total should be 3.000.000
    expect(screen.getByText(/3\.000\.000/)).toBeInTheDocument();
  });

  it('harusnya merender jumlah aset yang dikelola', () => {
    (useStore as any).mockReturnValue({
      assets: [
        { id: '1', name: 'Aset 1', valuation: 1000000, category: 'Real Estat', status: 'Siap', checklist: [] }
      ],
      activities: []
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/1 Total/)).toBeInTheDocument();
  });
});
