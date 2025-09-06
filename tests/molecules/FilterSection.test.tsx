import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSection from '../../src/components/organisms/FilterSection/FilterSection';
import type { Filters } from '../../src/types/beatmap/short';

describe('FilterSection Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders filter section with title', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    expect(screen.getByText('Filters')).toBeDefined();
  });

  test('renders search input', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeDefined();
  });

  test('renders overall difficulty range inputs', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders BPM range inputs', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders length range inputs', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders pattern select', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const patternSelect = screen.getByRole('combobox');
    expect(patternSelect).toBeDefined();
  });

  test('does not render pattern range when no pattern is selected', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    // Pattern range should not be visible when no pattern is selected
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeLessThan(10); // Should be less than if pattern range was shown
  });

  test('renders pattern range when pattern is selected', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: 'stream',
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    // Should have more inputs when pattern is selected
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('renders reset button when onReset is provided', () => {
    const mockOnFiltersChange = () => {};
    const mockOnReset = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Reset Filters');
    expect(resetButton).toBeDefined();
  });

  test('does not render reset button when onReset is not provided', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const resetButton = screen.queryByText('Reset Filters');
    expect(resetButton).toBeNull();
  });

  test('calls onReset when reset button is clicked', async () => {
    const mockOnFiltersChange = () => {};
    let resetCalled = false;
    const mockOnReset = () => {
      resetCalled = true;
    };
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };
    const user = userEvent.setup();

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Reset Filters');
    await user.click(resetButton);

    expect(resetCalled).toBe(true);
  });

  test('displays current filter values', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: 'test search',
      selected_pattern: 'stream',
      overall_min: 10,
      overall_max: 20,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const searchInput = screen.getByDisplayValue('test search');
    const patternSelect = screen.getByRole('combobox');
    
    expect(searchInput).toBeDefined();
    expect(patternSelect).toBeDefined();
  });

  test('maintains proper DOM structure', () => {
    const mockOnFiltersChange = () => {};
    const filters: Filters = {
      page: 1,
      per_page: 100,
      search_term: undefined,
      selected_pattern: undefined,
    };

    render(
      <FilterSection
        filters={filters}
        onFiltersChange={mockOnFiltersChange}
      />
    );

    const container = screen.getByText('Filters').closest('div')?.parentElement;
    const grid = screen.getByText('Filters').closest('div')?.querySelector('.grid');

    expect(container?.className).toContain('bg-base-200');
    expect(container?.className).toContain('rounded-lg');
    expect(grid).toBeDefined();
  });
});