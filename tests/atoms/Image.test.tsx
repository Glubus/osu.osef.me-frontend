import { expect, test, describe, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { Image } from '../../src/components/atoms/Image/Image';
import React from 'react';

describe('Image Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders image with src and alt attributes', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image).toBeDefined();
    expect(image.src).toBe('https://example.com/image.jpg');
    expect(image.alt).toBe('Test image');
  });

  test('renders image with custom className', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" className="custom-class" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('custom-class');
  });

  test('renders image without custom className', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });

  test('renders image with all default classes', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });

  test('renders image with empty className', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" className="" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });

  test('renders image with undefined className', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" className={undefined} />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });

  test('renders image with relative src path', () => {
    render(<Image src="/images/logo.png" alt="Logo" />);
    
    const image = screen.getByAltText('Logo') as HTMLImageElement;
    expect(image.src).toContain('/images/logo.png');
  });

  test('renders image with data URL src', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    render(<Image src={dataUrl} alt="Data image" />);
    
    const image = screen.getByAltText('Data image') as HTMLImageElement;
    expect(image.src).toBe(dataUrl);
  });

  test('renders image with empty alt text', () => {
    render(<Image src="https://example.com/image.jpg" alt="" />);
    
    const image = screen.getByAltText('') as HTMLImageElement;
    expect(image.alt).toBe('');
  });

  test('renders image with long alt text', () => {
    const longAlt = 'This is a very long alt text that describes the image in detail for accessibility purposes';
    render(<Image src="https://example.com/image.jpg" alt={longAlt} />);
    
    const image = screen.getByAltText(longAlt) as HTMLImageElement;
    expect(image.alt).toBe(longAlt);
  });

  test('renders image with special characters in alt', () => {
    const specialAlt = 'Image with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<Image src="https://example.com/image.jpg" alt={specialAlt} />);
    
    const image = screen.getByAltText(specialAlt) as HTMLImageElement;
    expect(image.alt).toBe(specialAlt);
  });

  test('renders image with special characters in src', () => {
    const specialSrc = 'https://example.com/image%20with%20spaces.jpg';
    render(<Image src={specialSrc} alt="Special src" />);
    
    const image = screen.getByAltText('Special src') as HTMLImageElement;
    expect(image.src).toBe(specialSrc);
  });

  test('renders multiple images independently', () => {
    render(
      <div>
        <Image src="https://example.com/image1.jpg" alt="Image 1" className="class1" />
        <Image src="https://example.com/image2.jpg" alt="Image 2" className="class2" />
        <Image src="https://example.com/image3.jpg" alt="Image 3" />
      </div>
    );
    
    const image1 = screen.getByAltText('Image 1') as HTMLImageElement;
    const image2 = screen.getByAltText('Image 2') as HTMLImageElement;
    const image3 = screen.getByAltText('Image 3') as HTMLImageElement;
    
    expect(image1.src).toBe('https://example.com/image1.jpg');
    expect(image1.className).toContain('class1');
    
    expect(image2.src).toBe('https://example.com/image2.jpg');
    expect(image2.className).toContain('class2');
    
    expect(image3.src).toBe('https://example.com/image3.jpg');
    expect(image3.className).not.toContain('class1');
    expect(image3.className).not.toContain('class2');
  });

  test('maintains proper DOM structure', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" className="test-class" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.tagName).toBe('IMG');
    expect(image.src).toBe('https://example.com/image.jpg');
    expect(image.alt).toBe('Test image');
    expect(image.className).toContain('test-class');
  });

  test('renders image with combined className', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" className="custom rounded shadow" />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
    expect(image.className).toContain('custom');
    expect(image.className).toContain('rounded');
    expect(image.className).toContain('shadow');
  });

  test('handles image load event', () => {
    const handleLoad = () => {};
    render(<Image src="https://example.com/image.jpg" alt="Test image" onLoad={handleLoad} />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image).toBeDefined();
  });

  test('handles image error event', () => {
    const handleError = () => {};
    render(<Image src="https://example.com/invalid.jpg" alt="Test image" onError={handleError} />);
    
    const image = screen.getByAltText('Test image') as HTMLImageElement;
    expect(image).toBeDefined();
  });

  test('renders image with all props', () => {
    render(
      <Image 
        src="https://example.com/complete.jpg" 
        alt="Complete test image" 
        className="complete-class"
      />
    );
    
    const image = screen.getByAltText('Complete test image') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/complete.jpg');
    expect(image.alt).toBe('Complete test image');
    expect(image.className).toContain('complete-class');
    expect(image.className).toContain('w-full');
    expect(image.className).toContain('h-full');
    expect(image.className).toContain('object-cover');
  });
});
