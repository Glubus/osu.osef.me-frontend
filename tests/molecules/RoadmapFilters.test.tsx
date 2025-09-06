import React from 'react';
import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoadmapFilters } from '../../src/components/molecules/RoadmapFilters/RoadmapFilters';

describe('RoadmapFilters Component', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    statusFilter: 'all' as const,
    setStatusFilter: () => {},
    categoryFilter: 'all' as const,
    setCategoryFilter: () => {},
    priorityFilter: 'all' as const,
    setPriorityFilter: () => {}
  };

  test('renders roadmap filters', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    expect(screen.getByText('All Status')).toBeDefined();
    expect(screen.getByText('All Categories')).toBeDefined();
    expect(screen.getByText('All Priorities')).toBeDefined();
  });

  test('renders status filter', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    const statusSelect = screen.getByDisplayValue('All Status');
    expect(statusSelect).toBeDefined();
  });

  test('renders category filter', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toBeDefined();
  });

  test('renders priority filter', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    const prioritySelect = screen.getByDisplayValue('All Priorities');
    expect(prioritySelect).toBeDefined();
  });

  test('calls setStatusFilter when status changes', async () => {
    let statusChanged = false;
    const mockSetStatusFilter = () => {
      statusChanged = true;
    };
    const user = userEvent.setup();
    
    render(<RoadmapFilters {...defaultProps} setStatusFilter={mockSetStatusFilter} />);
    
    const statusSelect = screen.getByDisplayValue('All Status');
    await user.selectOptions(statusSelect, 'finished');
    
    expect(statusChanged).toBe(true);
  });

  test('calls setCategoryFilter when category changes', async () => {
    let categoryChanged = false;
    const mockSetCategoryFilter = () => {
      categoryChanged = true;
    };
    const user = userEvent.setup();
    
    render(<RoadmapFilters {...defaultProps} setCategoryFilter={mockSetCategoryFilter} />);
    
    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.selectOptions(categorySelect, 'core');
    
    expect(categoryChanged).toBe(true);
  });

  test('calls setPriorityFilter when priority changes', async () => {
    let priorityChanged = false;
    const mockSetPriorityFilter = () => {
      priorityChanged = true;
    };
    const user = userEvent.setup();
    
    render(<RoadmapFilters {...defaultProps} setPriorityFilter={mockSetPriorityFilter} />);
    
    const prioritySelect = screen.getByDisplayValue('All Priorities');
    await user.selectOptions(prioritySelect, 'high');
    
    expect(priorityChanged).toBe(true);
  });

  test('displays current filter values', () => {
    const propsWithValues = {
      ...defaultProps,
      statusFilter: 'finished' as const,
      categoryFilter: 'core' as const,
      priorityFilter: 'high' as const
    };
    
    render(<RoadmapFilters {...propsWithValues} />);
    
    expect(screen.getByDisplayValue('Finished')).toBeDefined();
    expect(screen.getByDisplayValue('Core')).toBeDefined();
    expect(screen.getByDisplayValue('High')).toBeDefined();
  });

  test('has correct CSS classes', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    const container = screen.getByDisplayValue('All Status').closest('div')?.parentElement?.parentElement;
    expect(container?.className).toContain('flex');
    expect(container?.className).toContain('flex-wrap');
    expect(container?.className).toContain('gap-4');
    expect(container?.className).toContain('mb-8');
    expect(container?.className).toContain('p-4');
    expect(container?.className).toContain('rounded-lg');
  });

  test('renders with proper layout', () => {
    render(<RoadmapFilters {...defaultProps} />);
    
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(3);
    
    selects.forEach(select => {
      const container = select.closest('div')?.parentElement;
      expect(container?.className).toContain('flex-1');
      expect(container?.className).toContain('min-w-[200px]');
    });
  });
});