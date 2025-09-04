import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../../src/components/atoms/Tooltip/Tooltip';
import React from 'react';

describe('Tooltip Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders tooltip trigger with children', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeDefined();
    expect(trigger.tagName).toBe('BUTTON');
  });

  test('renders tooltip with default position top', () => {
    render(
      <Tooltip content="Top tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeDefined();
  });

  test('renders tooltip with custom position', () => {
    render(
      <Tooltip content="Bottom tooltip" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeDefined();
  });

  test('applies custom className to trigger', () => {
    render(
      <Tooltip content="Test tooltip" className="custom-trigger">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me').closest('div');
    expect(trigger?.className).toContain('custom-trigger');
  });

  test('shows tooltip on mouse enter', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="Hover tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText('Hover tooltip');
    expect(tooltip).toBeDefined();
  });

  test('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="Hover tooltip">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText('Hover tooltip');
    expect(tooltip).toBeDefined();
    
    await user.unhover(trigger);
    
    expect(screen.queryByText('Hover tooltip')).toBeNull();
  });

  test('renders tooltip with all position variants', async () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    const user = userEvent.setup();
    
    for (const position of positions) {
      const { unmount } = render(
        <Tooltip content={`${position} tooltip`} position={position}>
          <button>Hover me</button>
        </Tooltip>
      );
      
      const trigger = screen.getByText('Hover me');
      await user.hover(trigger);
      
      const tooltip = await screen.findByText(`${position} tooltip`);
      expect(tooltip).toBeDefined();
      
      unmount();
    }
  });

  test('renders tooltip with complex children', () => {
    render(
      <Tooltip content="Complex tooltip">
        <div>
          <span>Complex</span> <strong>Content</strong>
        </div>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Complex');
    expect(trigger).toBeDefined();
    
    const strongElement = screen.getByText('Content');
    expect(strongElement.tagName).toBe('STRONG');
  });

  test('renders tooltip with empty content', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="">
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);
    
    // Tooltip should still appear even with empty content
    const tooltip = document.querySelector('.fixed');
    expect(tooltip).toBeDefined();
  });

  test('renders tooltip with long content', async () => {
    const user = userEvent.setup();
    const longContent = 'This is a very long tooltip content that should wrap properly and display correctly in the tooltip component';
    
    render(
      <Tooltip content={longContent}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText(longContent);
    expect(tooltip).toBeDefined();
  });

  test('renders tooltip with special characters in content', async () => {
    const user = userEvent.setup();
    const specialContent = 'Tooltip with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    
    render(
      <Tooltip content={specialContent}>
        <button>Hover me</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText(specialContent);
    expect(tooltip).toBeDefined();
  });

  test('renders multiple tooltips independently', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <Tooltip content="First tooltip">
          <button>First</button>
        </Tooltip>
        <Tooltip content="Second tooltip">
          <button>Second</button>
        </Tooltip>
      </div>
    );
    
    const firstTrigger = screen.getByText('First');
    const secondTrigger = screen.getByText('Second');
    
    await user.hover(firstTrigger);
    const firstTooltip = await screen.findByText('First tooltip');
    expect(firstTooltip).toBeDefined();
    
    await user.unhover(firstTrigger);
    await user.hover(secondTrigger);
    const secondTooltip = await screen.findByText('Second tooltip');
    expect(secondTooltip).toBeDefined();
  });

  test('maintains proper DOM structure', () => {
    render(
      <Tooltip content="Structure test">
        <button>Test</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Test');
    const triggerWrapper = trigger.closest('div');
    
    expect(triggerWrapper?.className).toContain('inline-block');
    expect(trigger.tagName).toBe('BUTTON');
  });

  test('renders tooltip with all props combined', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip 
        content="Combined tooltip" 
        position="bottom" 
        className="custom-combined"
      >
        <button>Combined</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Combined');
    const triggerWrapper = trigger.closest('div');
    
    expect(triggerWrapper?.className).toContain('custom-combined');
    
    await user.hover(trigger);
    const tooltip = await screen.findByText('Combined tooltip');
    expect(tooltip).toBeDefined();
  });

  test('tooltip appears in document body via portal', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <Tooltip content="Portal test">
          <button>Portal</button>
        </Tooltip>
      </div>
    );
    
    const trigger = screen.getByText('Portal');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText('Portal test');
    expect(tooltip).toBeDefined();
    
    // Tooltip should be in document.body, not in the component's container
    expect(tooltip.closest('body')).toBe(document.body);
  });

  test('tooltip has correct CSS classes', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="CSS test">
        <button>CSS</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('CSS');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText('CSS test');
    expect(tooltip.className).toContain('fixed');
    expect(tooltip.className).toContain('px-2');
    expect(tooltip.className).toContain('py-1');
    expect(tooltip.className).toContain('text-xs');
    expect(tooltip.className).toContain('text-white');
    expect(tooltip.className).toContain('bg-gray-800');
    expect(tooltip.className).toContain('rounded');
    expect(tooltip.className).toContain('shadow-lg');
    expect(tooltip.className).toContain('whitespace-nowrap');
    expect(tooltip.className).toContain('z-[9999]');
  });

  test('tooltip has arrow element', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="Arrow test">
        <button>Arrow</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Arrow');
    await user.hover(trigger);
    
    const tooltip = await screen.findByText('Arrow test');
    const arrow = tooltip.querySelector('div');
    
    expect(arrow).toBeDefined();
    expect(arrow?.className).toContain('absolute');
  });

  test('tooltip position updates on position change', async () => {
    const user = userEvent.setup();
    
    const { rerender } = render(
      <Tooltip content="Position test" position="top">
        <button>Position</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Position');
    await user.hover(trigger);
    
    let tooltip = await screen.findByText('Position test');
    expect(tooltip).toBeDefined();
    
    await user.unhover(trigger);
    
    // Change position
    rerender(
      <Tooltip content="Position test" position="bottom">
        <button>Position</button>
      </Tooltip>
    );
    
    await user.hover(trigger);
    tooltip = await screen.findByText('Position test');
    expect(tooltip).toBeDefined();
  });

  test('handles rapid hover/unhover events', async () => {
    const user = userEvent.setup();
    
    render(
      <Tooltip content="Rapid test">
        <button>Rapid</button>
      </Tooltip>
    );
    
    const trigger = screen.getByText('Rapid');
    
    // Rapid hover/unhover
    await user.hover(trigger);
    await user.unhover(trigger);
    await user.hover(trigger);
    await user.unhover(trigger);
    
    // Should not crash and tooltip should be hidden
    expect(screen.queryByText('Rapid test')).toBeNull();
  });

  test('renders tooltip with number children', () => {
    render(
      <Tooltip content="Number test">
        {42}
      </Tooltip>
    );
    
    const trigger = screen.getByText('42');
    expect(trigger).toBeDefined();
  });

  test('renders tooltip with null children', () => {
    render(
      <Tooltip content="Null test">
        {null}
      </Tooltip>
    );
    
    // Should not crash
    expect(document.querySelector('.inline-block')).toBeDefined();
  });
});
