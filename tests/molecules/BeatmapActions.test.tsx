import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeatmapActions from '../../src/components/molecules/BeatmapActions';

describe('BeatmapActions Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders download button', () => {
    const mockOnDownload = () => {};
    
    render(<BeatmapActions onDownload={mockOnDownload} />);
    
    const downloadButton = screen.getByText('Download');
    expect(downloadButton).toBeDefined();
  });

  test('calls onDownload when download button is clicked', async () => {
    let downloadCalled = false;
    const mockOnDownload = () => {
      downloadCalled = true;
    };
    const user = userEvent.setup();
    
    render(<BeatmapActions onDownload={mockOnDownload} />);
    
    const downloadButton = screen.getByText('Download');
    await user.click(downloadButton);
    
    expect(downloadCalled).toBe(true);
  });

  test('has correct button styling', () => {
    const mockOnDownload = () => {};
    
    render(<BeatmapActions onDownload={mockOnDownload} />);
    
    const downloadButton = screen.getByText('Download');
    expect(downloadButton.className).toContain('btn');
    expect(downloadButton.className).toContain('btn-secondary');
    expect(downloadButton.className).toContain('btn-outline');
    expect(downloadButton.className).toContain('btn-lg');
    expect(downloadButton.className).toContain('w-full');
  });

  test('maintains proper DOM structure', () => {
    const mockOnDownload = () => {};
    
    render(<BeatmapActions onDownload={mockOnDownload} />);
    
    const container = screen.getByText('Download').closest('div');
    expect(container?.className).toContain('w-64');
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(container?.className).toContain('gap-3');
  });
});
