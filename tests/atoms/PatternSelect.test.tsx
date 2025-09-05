import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PatternSelect from '../../src/components/atoms/PatternSelect/PatternSelect';

describe('PatternSelect Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders pattern select with label and tooltip', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value="stream"
        onChange={handleChange}
      />
    );
    
    const label = screen.getByText('Pattern');
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    
    expect(label).toBeDefined();
    expect(select).toBeDefined();
    expect(select.value).toBe('stream');
  });

  test('renders with empty value', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value=""
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
  });

  test('calls onChange when select value changes', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <PatternSelect
        value=""
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'stream');
    
    expect(changedValue).toBe('stream');
  });

  test('renders with correct id', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value=""
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.id).toBe('pattern-select');
  });

  test('renders all pattern options', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value=""
        onChange={handleChange}
      />
    );
    
    expect(screen.getByText('All patterns')).toBeDefined();
    expect(screen.getByText('Stream')).toBeDefined();
    expect(screen.getByText('Jumpstream')).toBeDefined();
    expect(screen.getByText('Handstream')).toBeDefined();
    expect(screen.getByText('Stamina')).toBeDefined();
    expect(screen.getByText('Jackspeed')).toBeDefined();
    expect(screen.getByText('Chordjack')).toBeDefined();
    expect(screen.getByText('Technical')).toBeDefined();
  });

  test('handles different pattern values', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value="jumpstream"
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('jumpstream');
  });

  test('renders multiple PatternSelects independently', () => {
    const handleChange1 = () => {};
    const handleChange2 = () => {};
    
    render(
      <div>
        <PatternSelect
          value="stream"
          onChange={handleChange1}
        />
        <PatternSelect
          value="stamina"
          onChange={handleChange2}
        />
      </div>
    );
    
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('stream');
    expect(selects[1].value).toBe('stamina');
  });

  test('handles empty string value', () => {
    const handleChange = () => {};
    render(
      <PatternSelect
        value=""
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
  });
});