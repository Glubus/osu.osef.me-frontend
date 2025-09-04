import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../../src/components/atoms/Select/Select';
import React from 'react';

describe('Select Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const numericOptions = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ];

  test('renders select with options', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(select.value).toBe('option1');
  });

  test('renders select with label', () => {
    const handleChange = () => {};
    render(
      <Select 
        value="option1" 
        onChange={handleChange} 
        options={mockOptions} 
        label="Choose Option" 
        id="test-select" 
      />
    );
    
    const label = screen.getByText('Choose Option');
    const select = screen.getByLabelText('Choose Option') as HTMLSelectElement;
    
    expect(label).toBeDefined();
    expect(select).toBeDefined();
    expect(select.id).toBe('test-select');
  });

  test('renders select without label when not provided', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(screen.queryByText('Choose Option')).toBeNull();
  });

  test('renders all options', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe('Option 1');
    expect(options[1].textContent).toBe('Option 2');
    expect(options[2].textContent).toBe('Option 3');
  });

  test('renders disabled select', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} disabled />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  test('renders enabled select by default', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select.disabled).toBe(false);
  });

  test('applies custom className', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} className="custom-class" />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select.className).toContain('custom-class');
  });

  test('calls onChange when selection changes', async () => {
    let selectedValue = 'option1';
    const handleChange = (value: string | number) => {
      selectedValue = value as string;
    };
    const user = userEvent.setup();
    
    render(<Select value={selectedValue} onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    await user.selectOptions(select, 'option2');
    
    expect(selectedValue).toBe('option2');
  });

  test('handles numeric values', () => {
    const handleChange = () => {};
    render(<Select value={2} onChange={handleChange} options={numericOptions} />);
    
    const select = screen.getByDisplayValue('Second') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  test('calls onChange with numeric values', async () => {
    let selectedValue = '1';
    const handleChange = (value: string | number) => {
      selectedValue = value as string;
    };
    const user = userEvent.setup();
    
    render(<Select value={1} onChange={handleChange} options={numericOptions} />);
    
    const select = screen.getByDisplayValue('First') as HTMLSelectElement;
    await user.selectOptions(select, '3');
    
    expect(selectedValue).toBe('3');
  });

  test('renders select with all default classes', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select.className).toContain('select');
    expect(select.className).toContain('select-bordered');
    expect(select.className).toContain('w-full');
  });

  test('renders select with id attribute', () => {
    const handleChange = () => {};
    render(<Select value="option1" onChange={handleChange} options={mockOptions} id="my-select" />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    expect(select.id).toBe('my-select');
  });

  test('associates label with select using htmlFor', () => {
    const handleChange = () => {};
    render(
      <Select 
        value="option1" 
        onChange={handleChange} 
        options={mockOptions} 
        label="Select Option" 
        id="select-input" 
      />
    );
    
    const label = screen.getByText('Select Option') as HTMLLabelElement;
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    
    expect(label.htmlFor).toBe('select-input');
    expect(select.id).toBe('select-input');
  });

  test('handles empty options array', () => {
    const handleChange = () => {};
    render(<Select value="" onChange={handleChange} options={[]} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(0);
  });

  test('handles single option', () => {
    const singleOption = [{ value: 'only', label: 'Only Option' }];
    const handleChange = () => {};
    render(<Select value="only" onChange={handleChange} options={singleOption} />);
    
    const select = screen.getByDisplayValue('Only Option') as HTMLSelectElement;
    const options = select.querySelectorAll('option');
    
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe('Only Option');
  });

  test('renders multiple selects independently', () => {
    const handleChange1 = () => {};
    const handleChange2 = () => {};
    
    render(
      <div>
        <Select value="option1" onChange={handleChange1} options={mockOptions} label="First Select" id="select1" />
        <Select value="option2" onChange={handleChange2} options={mockOptions} label="Second Select" id="select2" />
      </div>
    );
    
    const select1 = screen.getByLabelText('First Select') as HTMLSelectElement;
    const select2 = screen.getByLabelText('Second Select') as HTMLSelectElement;
    
    expect(select1.value).toBe('option1');
    expect(select2.value).toBe('option2');
    expect(select1.id).toBe('select1');
    expect(select2.id).toBe('select2');
  });

  test('maintains proper DOM structure', () => {
    const handleChange = () => {};
    render(
      <Select 
        value="option1" 
        onChange={handleChange} 
        options={mockOptions} 
        label="Test Label" 
        id="test" 
      />
    );
    
    const container = screen.getByLabelText('Test Label').closest('div');
    const label = screen.getByText('Test Label');
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-col');
    expect(label.tagName).toBe('LABEL');
    expect(select.tagName).toBe('SELECT');
  });

  test('handles focus events', async () => {
    const handleChange = () => {};
    const user = userEvent.setup();
    
    render(<Select value="option1" onChange={handleChange} options={mockOptions} />);
    
    const select = screen.getByDisplayValue('Option 1') as HTMLSelectElement;
    await user.click(select);
    
    expect(document.activeElement).toBe(select);
  });

  test('renders select with all props combined', () => {
    const handleChange = () => {};
    render(
      <Select 
        value="option2"
        onChange={handleChange}
        options={mockOptions}
        label="Combined Select"
        id="combined"
        className="custom-combined"
        disabled={false}
      />
    );
    
    const select = screen.getByLabelText('Combined Select') as HTMLSelectElement;
    const label = screen.getByText('Combined Select');
    
    expect(select.value).toBe('option2');
    expect(select.id).toBe('combined');
    expect(select.disabled).toBe(false);
    expect(select.className).toContain('custom-combined');
  });

  test('handles options with special characters', () => {
    const specialOptions = [
      { value: 'special1', label: 'Option with & symbols' },
      { value: 'special2', label: 'Option with <tags>' },
      { value: 'special3', label: 'Option with "quotes"' },
    ];
    const handleChange = () => {};
    
    render(<Select value="special1" onChange={handleChange} options={specialOptions} />);
    
    const select = screen.getByDisplayValue('Option with & symbols') as HTMLSelectElement;
    const options = select.querySelectorAll('option');
    
    expect(options[0].textContent).toBe('Option with & symbols');
    expect(options[1].textContent).toBe('Option with <tags>');
    expect(options[2].textContent).toBe('Option with "quotes"');
  });
});
