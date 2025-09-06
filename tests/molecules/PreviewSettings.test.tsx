import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PreviewSettings from '../../src/components/molecules/PreviewSettings';
import type { BeatmapPreviewSettings } from '../../src/hooks/preview/useBeatmapPreviewSettings';

describe('PreviewSettings Component', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultSettings: BeatmapPreviewSettings = {
    scrollDirection: 'up',
    noteType: 'circle',
    noteColor: '#ff6b35',
    lnColor: '#ff6b35',
    progressBarPosition: 'bottom'
  };

  const defaultProps = {
    settings: defaultSettings,
    onSettingChange: () => {},
    onReset: () => {}
  };

  test('renders settings title', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    expect(screen.getByText('Preview Settings')).toBeDefined();
  });

  test('renders reset button', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const resetButton = screen.getByText('Reset to Default');
    expect(resetButton).toBeDefined();
  });

  test('renders scroll direction select', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const scrollDirectionSelect = screen.getByDisplayValue('Upscroll');
    expect(scrollDirectionSelect).toBeDefined();
  });

  test('renders note type select', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const noteTypeSelect = screen.getByDisplayValue('Circle');
    expect(noteTypeSelect).toBeDefined();
  });

  test('renders note color input', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const noteColorInputs = screen.getAllByDisplayValue('#ff6b35');
    expect(noteColorInputs.length).toBeGreaterThan(0);
    expect(noteColorInputs[0].getAttribute('type')).toBe('color');
  });

  test('renders LN color input', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const lnColorInputs = screen.getAllByDisplayValue('#ff6b35');
    expect(lnColorInputs.length).toBeGreaterThan(0);
  });

  test('renders progress bar position select', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const progressBarSelect = screen.getByDisplayValue('Bottom');
    expect(progressBarSelect).toBeDefined();
  });

  test('calls onReset when reset button is clicked', async () => {
    let resetCalled = false;
    const mockOnReset = () => {
      resetCalled = true;
    };
    const user = userEvent.setup();
    
    render(<PreviewSettings {...defaultProps} onReset={mockOnReset} />);
    
    const resetButton = screen.getByText('Reset to Default');
    await user.click(resetButton);
    
    expect(resetCalled).toBe(true);
  });

  test('calls onSettingChange when scroll direction changes', async () => {
    let settingChanged = false;
    const mockOnSettingChange = () => {
      settingChanged = true;
    };
    const user = userEvent.setup();
    
    render(<PreviewSettings {...defaultProps} onSettingChange={mockOnSettingChange} />);
    
    const scrollDirectionSelect = screen.getByDisplayValue('Upscroll');
    await user.selectOptions(scrollDirectionSelect, 'down');
    
    expect(settingChanged).toBe(true);
  });

  test('calls onSettingChange when note type changes', async () => {
    let settingChanged = false;
    const mockOnSettingChange = () => {
      settingChanged = true;
    };
    const user = userEvent.setup();
    
    render(<PreviewSettings {...defaultProps} onSettingChange={mockOnSettingChange} />);
    
    const noteTypeSelect = screen.getByDisplayValue('Circle');
    await user.selectOptions(noteTypeSelect, 'rectangle');
    
    expect(settingChanged).toBe(true);
  });

  test('calls onSettingChange when note color changes', () => {
    let settingChanged = false;
    const mockOnSettingChange = () => {
      settingChanged = true;
    };
    
    render(<PreviewSettings {...defaultProps} onSettingChange={mockOnSettingChange} />);
    
    const noteColorInputs = screen.getAllByDisplayValue('#ff6b35');
    const noteColorInput = noteColorInputs[0]; // Get the first one (note color)
    fireEvent.change(noteColorInput, { target: { value: '#ff0000' } });
    
    expect(settingChanged).toBe(true);
  });

  test('calls onSettingChange when progress bar position changes', async () => {
    let settingChanged = false;
    const mockOnSettingChange = () => {
      settingChanged = true;
    };
    const user = userEvent.setup();
    
    render(<PreviewSettings {...defaultProps} onSettingChange={mockOnSettingChange} />);
    
    const progressBarSelect = screen.getByDisplayValue('Bottom');
    await user.selectOptions(progressBarSelect, 'top');
    
    expect(settingChanged).toBe(true);
  });

  test('displays current settings values', () => {
    const customSettings: BeatmapPreviewSettings = {
      scrollDirection: 'down',
      noteType: 'rectangle',
      noteColor: '#00ff00',
      lnColor: '#0000ff',
      progressBarPosition: 'top'
    };
    
    render(<PreviewSettings {...defaultProps} settings={customSettings} />);
    
    expect(screen.getByDisplayValue('Downscroll')).toBeDefined();
    expect(screen.getByDisplayValue('Rectangle')).toBeDefined();
    expect(screen.getByDisplayValue('#00ff00')).toBeDefined();
    expect(screen.getByDisplayValue('#0000ff')).toBeDefined();
    expect(screen.getByDisplayValue('Top')).toBeDefined();
  });

  test('has correct CSS classes', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const container = screen.getByText('Preview Settings').closest('div')?.parentElement;
    expect(container?.className).toContain('mb-3');
    expect(container?.className).toContain('p-3');
    expect(container?.className).toContain('bg-base-200');
    expect(container?.className).toContain('rounded');
    expect(container?.className).toContain('border');
    expect(container?.className).toContain('border-base-300');
    expect(container?.className).toContain('flex-shrink-0');
  });

  test('has correct grid layout', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const grid = screen.getByText('Preview Settings').closest('div')?.parentElement?.querySelector('.grid');
    expect(grid).toBeDefined();
    expect(grid?.className).toContain('grid-cols-2');
    expect(grid?.className).toContain('gap-4');
  });

  test('reset button has correct styling', () => {
    render(<PreviewSettings {...defaultProps} />);
    
    const resetButton = screen.getByText('Reset to Default');
    expect(resetButton.className).toContain('btn');
    expect(resetButton.className).toContain('btn-error');
    expect(resetButton.className).toContain('btn-sm');
  });
});
