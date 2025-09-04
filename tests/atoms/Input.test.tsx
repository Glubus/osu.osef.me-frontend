import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../src/components/atoms/Input/Input';
import React from 'react';

describe('Input Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders input with value', () => {
    const handleChange = () => {};
    render(<Input value="test value" onChange={handleChange} />);
    
    const input = screen.getByDisplayValue('test value') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.value).toBe('test value');
  });

  test('renders input with placeholder', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.placeholder).toBe('Enter text');
  });

  test('renders input with label', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} label="Test Label" id="test-input" />);
    
    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    
    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(input.id).toBe('test-input');
  });

  test('renders input without label when not provided', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeDefined();
    expect(screen.queryByText('Test Label')).toBeNull();
  });

  test('renders input with default type text', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  test('renders input with number type', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} type="number" />);
    
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  test('renders disabled input', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} disabled />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('renders enabled input by default', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('applies custom className', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} className="custom-class" />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('custom-class');
  });

  test('calls onChange when input value changes', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'h');
    
    expect(changedValue).toBe('h');
  });

  test('updates input value when controlled', async () => {
    let currentValue = '';
    const handleChange = (value: string) => {
      currentValue = value;
    };
    const user = userEvent.setup();
    
    const { rerender } = render(<Input value={currentValue} onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 't');
    
    // Simulate controlled update
    rerender(<Input value={currentValue} onChange={handleChange} />);
    
    expect(input.value).toBe('t');
  });

  test('renders input with all default classes', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('input');
    expect(input.className).toContain('input-bordered');
    expect(input.className).toContain('w-full');
  });

  test('renders input with id attribute', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} id="my-input" />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.id).toBe('my-input');
  });

  test('associates label with input using htmlFor', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} label="Email" id="email-input" />);
    
    const label = screen.getByText('Email') as HTMLLabelElement;
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(label.htmlFor).toBe('email-input');
    expect(input.id).toBe('email-input');
  });

  test('handles empty string value', () => {
    const handleChange = () => {};
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('handles numeric value in text input', () => {
    const handleChange = () => {};
    render(<Input value="123" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('123');
  });

  test('handles special characters in value', () => {
    const handleChange = () => {};
    render(<Input value="!@#$%^&*()" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('!@#$%^&*()');
  });

  test('renders multiple inputs independently', () => {
    const handleChange1 = () => {};
    const handleChange2 = () => {};
    
    render(
      <div>
        <Input value="input1" onChange={handleChange1} label="First Input" id="input1" />
        <Input value="input2" onChange={handleChange2} label="Second Input" id="input2" />
      </div>
    );
    
    const input1 = screen.getByLabelText('First Input') as HTMLInputElement;
    const input2 = screen.getByLabelText('Second Input') as HTMLInputElement;
    
    expect(input1.value).toBe('input1');
    expect(input2.value).toBe('input2');
    expect(input1.id).toBe('input1');
    expect(input2.id).toBe('input2');
  });

  test('maintains proper DOM structure', () => {
    const handleChange = () => {};
    render(<Input value="test" onChange={handleChange} label="Test Label" id="test" />);
    
    const container = screen.getByLabelText('Test Label').closest('div');
    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(label.tagName).toBe('LABEL');
    expect(input.tagName).toBe('INPUT');
  });

  test('handles focus events', async () => {
    const handleChange = () => {};
    const user = userEvent.setup();
    
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    
    expect(document.activeElement).toBe(input);
  });

  test('handles blur events', async () => {
    const handleChange = () => {};
    const user = userEvent.setup();
    
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.click(input);
    await user.tab();
    
    expect(document.activeElement).not.toBe(input);
  });

  test('renders input with all props combined', () => {
    const handleChange = () => {};
    render(
      <Input 
        value="combined test"
        onChange={handleChange}
        label="Combined Input"
        id="combined"
        placeholder="Enter combined value"
        type="text"
        className="custom-combined"
        disabled={false}
      />
    );
    
    const input = screen.getByLabelText('Combined Input') as HTMLInputElement;
    const label = screen.getByText('Combined Input');
    
    expect(input.value).toBe('combined test');
    expect(input.id).toBe('combined');
    expect(input.placeholder).toBe('Enter combined value');
    expect(input.type).toBe('text');
    expect(input.disabled).toBe(false);
    expect(input.className).toContain('custom-combined');
  });
});
