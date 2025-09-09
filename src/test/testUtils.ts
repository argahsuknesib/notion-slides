// Test utilities for Notion Slides extension
export function createMockNotionBlock(id: string, content: string, tag: string = 'div'): HTMLElement {
  const element = document.createElement(tag);
  element.setAttribute('data-block-id', id);
  element.textContent = content;
  return element;
}

export function createMockNotionPage(): HTMLElement {
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  // Add some mock blocks
  const titleBlock = createMockNotionBlock('title-1', 'Test Presentation', 'h1');
  const contentBlock1 = createMockNotionBlock('content-1', 'This is the first slide content');
  const separatorBlock = document.createElement('hr');
  separatorBlock.setAttribute('data-block-id', 'separator-1');
  const contentBlock2 = createMockNotionBlock('content-2', 'This is the second slide content');
  
  main.appendChild(titleBlock);
  main.appendChild(contentBlock1);
  main.appendChild(separatorBlock);
  main.appendChild(contentBlock2);
  
  return main;
}

export function createMockSlideData(): HTMLElement[][] {
  const slide1 = [createMockNotionBlock('block-1', 'Slide 1 content')];
  const slide2 = [createMockNotionBlock('block-2', 'Slide 2 content')];
  const slide3 = [createMockNotionBlock('block-3', 'Slide 3 content')];
  
  return [slide1, slide2, slide3];
}
