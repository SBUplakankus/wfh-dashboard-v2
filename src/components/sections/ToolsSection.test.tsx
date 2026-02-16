import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ToolsSection from './ToolsSection';

vi.mock('../../utils/ipc', () => ({
  listDirectory: vi.fn().mockResolvedValue([]),
  openApp: vi.fn(),
  openAppWithFile: vi.fn(),
  openFile: vi.fn(),
  readFile: vi.fn().mockResolvedValue(''),
  writeFile: vi.fn().mockResolvedValue({ ok: true })
}));

describe('ToolsSection', () => {
  it('shows integration fallback messages when optional data paths are not configured', async () => {
    render(<ToolsSection project={{ paths: {} }} />);

    await waitFor(() => {
      expect(screen.getByText('MkDocs Browser')).toBeTruthy();
      expect(screen.getByText(/Set MkDocs docs folder path/i)).toBeTruthy();
      expect(screen.getByText(/set Joplin data JSON path/i)).toBeTruthy();
      expect(screen.getByText(/set Kanri data JSON path/i)).toBeTruthy();
    });
  });
});
