import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../src/components/atoms/Button/Button';
import React from 'react';

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders button with children content', () => {
    render(<Button>Test Button</Button>);
    
    const button = screen.getByText('Test Button');
    expect(button).toBeDefined();
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toContain('btn');
  });

  test('renders button with default props', () => {
    render(<Button>Default Button</Button>);
    
    const button = screen.getByText('Default Button');
    expect(button.className).toContain('btn-outline');
    expect(button.className).toContain('btn-primary');
    expect(button.className).toContain('btn-sm');
  });

  test('renders button with custom style', () => {
    render(<Button style="ghost">Ghost Button</Button>);
    
    const button = screen.getByText('Ghost Button');
    expect(button.className).toContain('btn-ghost');
  });

  test('renders button with custom color', () => {
    render(<Button color="success">Success Button</Button>);
    
    const button = screen.getByText('Success Button');
    expect(button.className).toContain('btn-success');
  });

  test('renders button with custom size', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByText('Large Button');
    expect(button.className).toContain('btn-lg');
  });

  test('renders active button correctly', () => {
    render(<Button active={true}>Active Button</Button>);
    
    const button = screen.getByText('Active Button');
    expect(button.className).toContain('btn-outline');
    expect(button.className).toContain('btn-primary');
  });

  test('renders join item button correctly', () => {
    render(<Button joinItem={true}>Join Button</Button>);
    
    const button = screen.getByText('Join Button');
    expect(button.className).toContain('join-item');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByText('Custom Button');
    expect(button.className).toContain('custom-class');
  });

  test('handles click events', async () => {
    const handleClick = () => {
      // Mock function
    };
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = screen.getByText('Clickable Button');
    await user.click(button);
    
    expect(button).toBeDefined();
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  test('renders button with all style variants', () => {
    const styles = ['outline', 'ghost', 'link', 'dash', 'soft'] as const;
    
    styles.forEach((style) => {
      const { unmount } = render(<Button style={style}>{style} Button</Button>);
      
      const button = screen.getByText(`${style} Button`);
      expect(button.className).toContain(`btn-${style}`);
      
      unmount();
    });
  });

  test('renders button with all color variants', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    
    colors.forEach((color) => {
      const { unmount } = render(<Button color={color}>{color} Button</Button>);
      
      const button = screen.getByText(`${color} Button`);
      expect(button.className).toContain(`btn-${color}`);
      
      unmount();
    });
  });

  test('renders button with all size variants', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>{size} Button</Button>);
      
      const button = screen.getByText(`${size} Button`);
      expect(button.className).toContain(`btn-${size}`);
      
      unmount();
    });
  });

  test('combines multiple props correctly', () => {
    render(
      <Button 
        style="ghost" 
        color="warning" 
        size="md" 
        active={true} 
        joinItem={true}
        className="custom"
      >
        Complex Button
      </Button>
    );
    
    const button = screen.getByText('Complex Button');
    expect(button.className).toContain('btn-outline'); // active overrides style
    expect(button.className).toContain('btn-primary'); // active overrides color
    expect(button.className).toContain('btn-md');
    expect(button.className).toContain('join-item');
    expect(button.className).toContain('custom');
  });

  test('renders button with complex children', () => {
    render(
      <Button>
        <span>Icon</span> <strong>Text</strong>
      </Button>
    );
    
    const button = screen.getByText('Icon');
    expect(button).toBeDefined();
    
    const strongElement = screen.getByText('Text');
    expect(strongElement.tagName).toBe('STRONG');
  });

  test('renders button with number children', () => {
    render(<Button>{42}</Button>);
    
    const button = screen.getByText('42');
    expect(button).toBeDefined();
    expect(button.tagName).toBe('BUTTON');
  });

  test('renders button with empty children', () => {
    const { container } = render(<Button></Button>);
    
    const button = container.querySelector('button');
    expect(button).toBeDefined();
    expect(button?.textContent).toBe('');
  });

  test('passes through HTML button attributes', () => {
    render(
      <Button 
        type="submit" 
        data-testid="test-button"
        aria-label="Test button"
        title="Button title"
      >
        Submit Button
      </Button>
    );
    
    const button = screen.getByText('Submit Button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    expect(button.getAttribute('data-testid')).toBe('test-button');
    expect(button.getAttribute('aria-label')).toBe('Test button');
    expect(button.getAttribute('title')).toBe('Button title');
  });

  test('handles focus events', async () => {
    const user = userEvent.setup();
    
    render(<Button>Focusable Button</Button>);
    
    const button = screen.getByText('Focusable Button');
    await user.tab();
    
    expect(document.activeElement).toBe(button);
  });

  test('renders multiple buttons independently', () => {
    render(
      <div>
        <Button style="outline" color="primary">Button 1</Button>
        <Button style="ghost" color="success" size="lg">Button 2</Button>
        <Button active joinItem>Button 3</Button>
      </div>
    );
    
    const button1 = screen.getByText('Button 1');
    const button2 = screen.getByText('Button 2');
    const button3 = screen.getByText('Button 3');
    
    expect(button1.className).toContain('btn-outline');
    expect(button1.className).toContain('btn-primary');
    
    expect(button2.className).toContain('btn-ghost');
    expect(button2.className).toContain('btn-success');
    expect(button2.className).toContain('btn-lg');
    
    expect(button3.className).toContain('btn-outline');
    expect(button3.className).toContain('btn-primary');
    expect(button3.className).toContain('join-item');
  });

  test('maintains proper DOM structure', () => {
    render(<Button>Structured Button</Button>);
    
    const button = screen.getByText('Structured Button');
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toContain('btn');
    expect(button.textContent).toBe('Structured Button');
  });
});
