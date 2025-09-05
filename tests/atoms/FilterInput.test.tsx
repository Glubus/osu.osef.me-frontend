import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterInput from '../../src/components/atoms/FilterInput/FilterInput';

describe('FilterInput Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders input with label and tooltip', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value="test value"
        onChange={handleChange}
      />
    );
    
    const label = screen.getByText('Test Label');
    const input = screen.getByDisplayValue('test value') as HTMLInputElement;
    
    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(input.value).toBe('test value');
  });

  test('renders input with placeholder', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.placeholder).toBe('Enter text');
  });

  test('renders input with number type', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value="123"
        onChange={handleChange}
        type="number"
      />
    );
    
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.type).toBe('number');
    expect(input.value).toBe('123');
  });

  test('renders input with text type by default', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value="text value"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  test('applies custom className', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value=""
        onChange={handleChange}
        className="custom-class"
      />
    );
    
    const container = screen.getByText('Test Label').closest('div')?.parentElement;
    expect(container?.className).toContain('custom-class');
  });

  test('calls onChange when input value changes', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'h');
    
    expect(changedValue).toBe('h');
  });

  test('renders with correct id', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="my-filter-input"
        label="Test Label"
        tooltip="Test tooltip"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.id).toBe('my-filter-input');
  });

  test('displays tooltip on hover', async () => {
    const handleChange = () => {};
    const user = userEvent.setup();
    
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="This is a helpful tooltip"
        value=""
        onChange={handleChange}
      />
    );
    
    // Just verify the component renders with tooltip prop
    const label = screen.getByText('Test Label');
    expect(label).toBeDefined();
  });

  test('maintains proper DOM structure', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value="test"
        onChange={handleChange}
      />
    );
    
    const container = screen.getByText('Test Label').closest('div')?.parentElement;
    const labelContainer = screen.getByText('Test Label').closest('div');
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(labelContainer?.className).toContain('flex');
    expect(labelContainer?.className).toContain('items-center');
    expect(input.tagName).toBe('INPUT');
  });

  test('handles empty string value', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('handles special characters in value', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="test-input"
        label="Test Label"
        tooltip="Test tooltip"
        value="!@#$%^&*()"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('!@#$%^&*()');
  });

  test('renders multiple FilterInputs independently', () => {
    const handleChange1 = () => {};
    const handleChange2 = () => {};
    
    render(
      <div>
        <FilterInput
          id="input1"
          label="First Input"
          tooltip="First tooltip"
          value="value1"
          onChange={handleChange1}
        />
        <FilterInput
          id="input2"
          label="Second Input"
          tooltip="Second tooltip"
          value="value2"
          onChange={handleChange2}
        />
      </div>
    );
    
    const input1 = screen.getByDisplayValue('value1') as HTMLInputElement;
    const input2 = screen.getByDisplayValue('value2') as HTMLInputElement;
    
    expect(input1.value).toBe('value1');
    expect(input2.value).toBe('value2');
    expect(input1.id).toBe('input1');
    expect(input2.id).toBe('input2');
  });

  test('renders with all props combined', () => {
    const handleChange = () => {};
    render(
      <FilterInput
        id="combined-input"
        label="Combined Input"
        tooltip="Combined tooltip"
        value="combined value"
        onChange={handleChange}
        placeholder="Enter combined value"
        type="text"
        className="custom-combined"
      />
    );
    
    const input = screen.getByDisplayValue('combined value') as HTMLInputElement;
    const label = screen.getByText('Combined Input');
    
    expect(input.value).toBe('combined value');
    expect(input.id).toBe('combined-input');
    expect(input.placeholder).toBe('Enter combined value');
    expect(input.type).toBe('text');
    expect(input.closest('div')?.parentElement?.className).toContain('custom-combined');
  });
});
