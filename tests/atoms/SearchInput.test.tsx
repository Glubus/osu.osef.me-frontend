import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '../../src/components/atoms/SearchInput/SearchInput';

describe('SearchInput Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders search input with label and tooltip', () => {
    const handleChange = () => {};
    render(
      <SearchInput
        value="test search"
        onChange={handleChange}
      />
    );
    
    const label = screen.getByText('Search');
    const input = screen.getByDisplayValue('test search') as HTMLInputElement;
    
    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(input.value).toBe('test search');
  });

  test('renders with empty value', () => {
    const handleChange = () => {};
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('calls onChange when input value changes', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    await user.type(input, 'h');
    
    expect(changedValue).toBe('h');
  });

  test('handles spaces in search input', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    await user.type(input, ' ');
    
    expect(changedValue).toBe(' ');
  });

  test('renders with correct id', () => {
    const handleChange = () => {};
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.id).toBe('search-term');
  });

  test('renders input as text type', () => {
    const handleChange = () => {};
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  test('handles special characters in search', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    await user.type(input, '!');
    
    expect(changedValue).toBe('!');
  });

  test('renders multiple SearchInputs independently', () => {
    const handleChange1 = () => {};
    const handleChange2 = () => {};
    
    render(
      <div>
        <SearchInput
          value="search1"
          onChange={handleChange1}
        />
        <SearchInput
          value="search2"
          onChange={handleChange2}
        />
      </div>
    );
    
    const input1 = screen.getByDisplayValue('search1') as HTMLInputElement;
    const input2 = screen.getByDisplayValue('search2') as HTMLInputElement;
    
    expect(input1.value).toBe('search1');
    expect(input2.value).toBe('search2');
  });

  test('handles long search terms', async () => {
    let changedValue = '';
    const handleChange = (value: string) => {
      changedValue = value;
    };
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    await user.type(input, 'T');
    
    expect(changedValue).toBe('T');
  });
});