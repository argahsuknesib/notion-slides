import { 
  isSeparatorBlock, 
  getDocumentTitle,
  createTitleSlide
} from '../utils/slideUtils';

describe('Slide Building Utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('isSeparatorBlock', () => {
    it('should return true for elements containing hr', () => {
      const element = document.createElement('div');
      const hr = document.createElement('hr');
      element.appendChild(hr);
      
      expect(isSeparatorBlock(element)).toBe(true);
    });

    it('should return true for elements with role="separator"', () => {
      const element = document.createElement('div');
      const separator = document.createElement('div');
      separator.setAttribute('role', 'separator');
      element.appendChild(separator);
      
      expect(isSeparatorBlock(element)).toBe(true);
    });

    it('should return true for elements with three or more dashes', () => {
      const element = document.createElement('div');
      element.innerText = '---';
      
      expect(isSeparatorBlock(element)).toBe(true);
    });

    it('should return true for elements with four or more dashes', () => {
      const element = document.createElement('div');
      element.innerText = '----';
      
      expect(isSeparatorBlock(element)).toBe(true);
    });

    it('should return false for regular content', () => {
      const element = document.createElement('div');
      element.innerText = 'Regular content';
      
      expect(isSeparatorBlock(element)).toBe(false);
    });

    it('should return false for two dashes', () => {
      const element = document.createElement('div');
      element.innerText = '--';
      
      expect(isSeparatorBlock(element)).toBe(false);
    });
  });

  describe('getDocumentTitle', () => {
    it('should return document title when available', () => {
      Object.defineProperty(document, 'title', {
        value: 'Test Document Title',
        writable: true,
      });
      
      expect(getDocumentTitle()).toBe('Test Document Title');
    });

    it('should return h1 content when document title is "Notion"', () => {
      Object.defineProperty(document, 'title', {
        value: 'Notion',
        writable: true,
      });
      
      const h1 = document.createElement('h1');
      h1.textContent = 'Main Heading';
      document.body.appendChild(h1);
      
      expect(getDocumentTitle()).toBe('Main Heading');
    });

    it('should return "Untitled" when no title found', () => {
      Object.defineProperty(document, 'title', {
        value: 'Notion',
        writable: true,
      });
      
      expect(getDocumentTitle()).toBe('Untitled');
    });
  });

  describe('createTitleSlide', () => {
    it('should create title slide with document title', () => {
      Object.defineProperty(document, 'title', {
        value: 'My Presentation',
        writable: true,
      });
      
      const titleSlide = createTitleSlide();
      expect(titleSlide.className).toBe('np-title-slide');
      expect(titleSlide.innerHTML).toContain('My Presentation');
      expect(titleSlide.innerHTML).toContain('<h1 class="np-title-main">');
    });
  });
});
