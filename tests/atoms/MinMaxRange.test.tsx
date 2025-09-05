import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MinMaxRange from '../../src/components/atoms/MinMaxRange/MinMaxRange';

describe('MinMaxRange Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders min and max inputs with labels', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        minValue={10}
        maxValue={20}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByDisplayValue('10') as HTMLInputElement;
    const maxInput = screen.getByDisplayValue('20') as HTMLInputElement;
    
    expect(minInput).toBeDefined();
    expect(maxInput).toBeDefined();
    expect(minInput.value).toBe('10');
    expect(maxInput.value).toBe('20');
  });

  test('renders with undefined values', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
    const maxInput = screen.getByPlaceholderText('Max') as HTMLInputElement;
    
    expect(minInput.value).toBe('');
    expect(maxInput.value).toBe('');
  });

  test('calls onMinChange when min input changes', async () => {
    let changedValue: number | undefined;
    const handleMinChange = (value: number | undefined) => {
      changedValue = value;
    };
    const handleMaxChange = () => {};
    const user = userEvent.setup();
    
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
    await user.type(minInput, '1');
    
    expect(changedValue).toBe(1);
  });

  test('calls onMaxChange when max input changes', async () => {
    let changedValue: number | undefined;
    const handleMinChange = () => {};
    const handleMaxChange = (value: number | undefined) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const maxInput = screen.getByPlaceholderText('Max') as HTMLInputElement;
    await user.type(maxInput, '2');
    
    expect(changedValue).toBe(2);
  });

  test('renders with correct ids', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    render(
      <MinMaxRange
        idPrefix="custom-prefix"
        label="Test Range"
        tooltip="Test tooltip"
        minValue={undefined}
        maxValue={undefined}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
    const maxInput = screen.getByPlaceholderText('Max') as HTMLInputElement;
    
    expect(minInput.id).toBe('custom-prefix-min');
    expect(maxInput.id).toBe('custom-prefix-max');
  });

  test('renders inputs as number type', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
    const maxInput = screen.getByPlaceholderText('Max') as HTMLInputElement;
    
    expect(minInput.type).toBe('number');
    expect(maxInput.type).toBe('number');
  });

  test('handles decimal values', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        minValue={10.5}
        maxValue={20.75}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByDisplayValue('10.5') as HTMLInputElement;
    const maxInput = screen.getByDisplayValue('20.75') as HTMLInputElement;
    
    expect(minInput.value).toBe('10.5');
    expect(maxInput.value).toBe('20.75');
  });

  test('handles negative values', () => {
    const handleMinChange = () => {};
    const handleMaxChange = () => {};
    render(
      <MinMaxRange
        idPrefix="test"
        label="Test Range"
        tooltip="Test tooltip"
        minValue={-10}
        maxValue={-5}
        onMinChange={handleMinChange}
        onMaxChange={handleMaxChange}
      />
    );
    
    const minInput = screen.getByDisplayValue('-10') as HTMLInputElement;
    const maxInput = screen.getByDisplayValue('-5') as HTMLInputElement;
    
    expect(minInput.value).toBe('-10');
    expect(maxInput.value).toBe('-5');
  });

  test('renders multiple MinMaxRanges independently', () => {
    const handleMinChange1 = () => {};
    const handleMaxChange1 = () => {};
    const handleMinChange2 = () => {};
    const handleMaxChange2 = () => {};
    
    render(
      <div>
        <MinMaxRange
          idPrefix="range1"
          label="First Range"
          tooltip="First tooltip"
          minValue={1}
          maxValue={10}
          onMinChange={handleMinChange1}
          onMaxChange={handleMaxChange1}
        />
        <MinMaxRange
          idPrefix="range2"
          label="Second Range"
          tooltip="Second tooltip"
          minValue={20}
          maxValue={30}
          onMinChange={handleMinChange2}
          onMaxChange={handleMaxChange2}
        />
      </div>
    );
    
    const minInput1 = screen.getByDisplayValue('1') as HTMLInputElement;
    const maxInput1 = screen.getByDisplayValue('10') as HTMLInputElement;
    const minInput2 = screen.getByDisplayValue('20') as HTMLInputElement;
    const maxInput2 = screen.getByDisplayValue('30') as HTMLInputElement;
    
    expect(minInput1.id).toBe('range1-min');
    expect(maxInput1.id).toBe('range1-max');
    expect(minInput2.id).toBe('range2-min');
    expect(maxInput2.id).toBe('range2-max');
  });
});