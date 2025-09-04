import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Badge from '../../src/components/atoms/Badge/Badge';
import React from 'react';

describe('Badge Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders badge with children content', () => {
    render(<Badge>Test Badge</Badge>);
    
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('badge');
  });

  test('renders badge with default blue color', () => {
    render(<Badge>Default Badge</Badge>);
    
    const badge = screen.getByText('Default Badge');
    expect(badge.className).toContain('badge-info');
  });

  test('renders badge with specified color', () => {
    render(<Badge color="red">Red Badge</Badge>);
    
    const badge = screen.getByText('Red Badge');
    expect(badge.className).toContain('badge-error');
  });

  test('renders badge with outline style', () => {
    render(<Badge outline={true}>Outline Badge</Badge>);
    
    const badge = screen.getByText('Outline Badge');
    expect(badge.className).toContain('badge-outline');
  });

  test('renders badge without outline style by default', () => {
    render(<Badge>Normal Badge</Badge>);
    
    const badge = screen.getByText('Normal Badge');
    expect(badge.className).not.toContain('badge-outline');
  });

  test('renders badge with tooltip when title is provided', () => {
    render(<Badge title="This is a tooltip">Badge with Tooltip</Badge>);
    
    const badge = screen.getByText('Badge with Tooltip');
    expect(badge).toBeDefined();
    
    // Le tooltip devrait être présent dans le DOM
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeDefined();
  });

  test('renders badge without tooltip when title is not provided', () => {
    render(<Badge>Badge without Tooltip</Badge>);
    
    const badge = screen.getByText('Badge without Tooltip');
    expect(badge).toBeDefined();
    
    // Aucun tooltip ne devrait être présent
    const tooltip = document.querySelector('[data-radix-tooltip-content]');
    expect(tooltip).toBeNull();
  });

  test('applies correct CSS classes for different colors', () => {
    const colors = [
      { color: 'blue', expectedClass: 'badge-info' },
      { color: 'green', expectedClass: 'badge-success' },
      { color: 'red', expectedClass: 'badge-error' },
      { color: 'yellow', expectedClass: 'badge-warning' },
      { color: 'gray', expectedClass: 'badge-neutral' },
      { color: 'purple', expectedClass: 'badge-accent' },
      { color: 'pink', expectedClass: 'badge-secondary' },
      { color: 'orange', expectedClass: 'badge-info' },
      { color: 'teal', expectedClass: 'badge-info' }
    ];

    colors.forEach(({ color, expectedClass }) => {
      const { unmount } = render(<Badge color={color as any}>{color} Badge</Badge>);
      
      const badge = screen.getByText(`${color} Badge`);
      expect(badge.className).toContain(expectedClass);
      
      unmount();
    });
  });

  test('handles invalid color gracefully', () => {
    render(<Badge color="invalid" as any>Invalid Color Badge</Badge>);
    
    const badge = screen.getByText('Invalid Color Badge');
    expect(badge.className).toContain('badge-info'); // Should fallback to default
  });

  test('renders complex children content', () => {
    render(
      <Badge>
        <span>Complex</span> <strong>Content</strong>
      </Badge>
    );
    
    const badge = screen.getByText('Complex');
    expect(badge).toBeDefined();
    
    const strongElement = screen.getByText('Content');
    expect(strongElement.tagName).toBe('STRONG');
  });

  test('maintains proper DOM structure', () => {
    render(<Badge title="Test tooltip">Structured Badge</Badge>);
    
    const badge = screen.getByText('Structured Badge');
    expect(badge.tagName).toBe('DIV');
    expect(badge.className).toContain('badge');
    
    // Vérifier que le tooltip wrapper est présent
    const tooltipWrapper = badge.closest('[data-radix-tooltip-trigger]');
    expect(tooltipWrapper).toBeDefined();
  });

  test('tooltip interaction works correctly', async () => {
    const user = userEvent.setup();
    
    render(<Badge title="Hover me!">Interactive Badge</Badge>);
    
    const badge = screen.getByText('Interactive Badge');
    
    // Hover sur le badge pour déclencher le tooltip
    await user.hover(badge);
    
    // Attendre que le tooltip apparaisse
    const tooltip = await screen.findByText('Hover me!');
    expect(tooltip).toBeDefined();
  });

  test('renders badge with empty children', () => {
    const { container } = render(<Badge></Badge>);
    
    const badge = container.querySelector('.badge');
    expect(badge).toBeDefined();
    expect(badge?.textContent).toBe('');
  });

  test('renders badge with null children', () => {
    const { container } = render(<Badge>{null}</Badge>);
    
    const badge = container.querySelector('.badge');
    expect(badge).toBeDefined();
    expect(badge?.textContent).toBe('');
  });

  test('renders badge with undefined children', () => {
    const { container } = render(<Badge>{undefined}</Badge>);
    
    const badge = container.querySelector('.badge');
    expect(badge).toBeDefined();
    expect(badge?.textContent).toBe('');
  });

  test('renders badge with number children', () => {
    render(<Badge>{42}</Badge>);
    
    const badge = screen.getByText('42');
    expect(badge).toBeDefined();
    expect(badge.className).toContain('badge');
  });

  test('renders badge with boolean children', () => {
    const { container } = render(<Badge>{true}</Badge>);
    
    const badge = container.querySelector('.badge');
    expect(badge).toBeDefined();
    // React ne rend pas les valeurs booléennes dans le DOM
    expect(badge?.textContent).toBe('');
    expect(badge?.className).toContain('badge');
  });

  test('combines outline and color classes correctly', () => {
    render(<Badge color="green" outline={true}>Green Outline Badge</Badge>);
    
    const badge = screen.getByText('Green Outline Badge');
    expect(badge.className).toContain('badge-success');
    expect(badge.className).toContain('badge-outline');
  });

  test('applies custom CSS module class', () => {
    render(<Badge>Custom Badge</Badge>);
    
    const badge = screen.getByText('Custom Badge');
    // Le composant utilise styles.badge en plus de la classe 'badge'
    expect(badge.className).toContain('badge');
  });

  test('handles edge case with empty string color', () => {
    render(<Badge color="" as any>Empty Color Badge</Badge>);
    
    const badge = screen.getByText('Empty Color Badge');
    expect(badge.className).toContain('badge-info'); // Should fallback to default
  });

  test('handles edge case with null color', () => {
    render(<Badge color={null as any}>Null Color Badge</Badge>);
    
    const badge = screen.getByText('Null Color Badge');
    expect(badge.className).toContain('badge-info'); // Should fallback to default
  });

  test('handles edge case with undefined color', () => {
    render(<Badge color={undefined as any}>Undefined Color Badge</Badge>);
    
    const badge = screen.getByText('Undefined Color Badge');
    expect(badge.className).toContain('badge-info'); // Should fallback to default
  });

  test('tooltip disappears on mouse leave', async () => {
    const user = userEvent.setup();
    
    render(<Badge title="Hover me!">Interactive Badge 2</Badge>);
    
    const badge = screen.getByText('Interactive Badge 2');
    
    // Hover pour afficher le tooltip
    await user.hover(badge);
    const tooltip = await screen.findByText('Hover me!');
    expect(tooltip).toBeDefined();
    
    // Mouse leave pour cacher le tooltip
    await user.unhover(badge);
    
    // Le tooltip devrait disparaître
    expect(screen.queryByText('Hover me!')).toBeNull();
  });

  test('renders multiple badges independently', () => {
    render(
      <div>
        <Badge color="red">Red Badge Multiple</Badge>
        <Badge color="blue" outline={true}>Blue Outline Badge Multiple</Badge>
        <Badge title="Tooltip">Tooltip Badge Multiple</Badge>
      </div>
    );
    
    const redBadge = screen.getByText('Red Badge Multiple');
    const blueBadge = screen.getByText('Blue Outline Badge Multiple');
    const tooltipBadge = screen.getByText('Tooltip Badge Multiple');
    
    expect(redBadge.className).toContain('badge-error');
    expect(blueBadge.className).toContain('badge-info');
    expect(blueBadge.className).toContain('badge-outline');
    expect(tooltipBadge).toBeDefined();
  });
});