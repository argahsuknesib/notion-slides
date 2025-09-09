// Content script for Chrome extension
import './content.css';

// Only run on Notion pages
if (!window.location.href.includes('notion.so') && !window.location.href.includes('notion.site')) {
  console.log('Notion Presentation Mode: Not a Notion page, exiting');
} else {
  console.log('Notion Presentation Mode: Content script loaded on', window.location.href);
  
  (() => {
  const OVERLAY_ID = 'np-overlay';
  const STAGE_CLASS = 'np-stage';
  const SLIDE_CLASS = 'np-slide';
  const ACTIVE_CLASS = 'np-active';

  let isActive = false;
  let slides: HTMLElement[][] = [];
  let idx = 0;
  let observer: MutationObserver | null = null;
  let keyHandlerBound: ((e: KeyboardEvent) => void) | null = null;

  chrome.runtime.onMessage.addListener((msg: { type: string }, sender?: any, sendResponse?: any) => {
    console.log('Content: Received message:', msg);
    try {
      if (msg?.type === 'TOGGLE_PRESENTATION') {
        console.log('Content: Toggling presentation mode');
        togglePresentation();
        if (sendResponse) sendResponse({ success: true });
      } else {
        console.warn('Content: Unknown message type:', msg?.type);
        if (sendResponse) sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Content: Error handling message:', error);
      if (sendResponse) sendResponse({ success: false, error: error });
    }
    return true; // Indicates we will respond asynchronously
  });

  // Add test button when content script loads
  setTimeout(addTestButton, 1000); // Wait a bit for page to load

  document.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.code, 'Alt:', e.altKey, 'Shift:', e.shiftKey);
    if (e.altKey && e.shiftKey && e.code === 'KeyP') {
      console.log('Presentation shortcut detected!');
      e.preventDefault();
      e.stopPropagation();
      togglePresentation();
    }
  }, true); // Use capture phase

  function togglePresentation() {
    if (isActive) {
      exitPresentation();
      return;
    }
    const root = resolvePageRoot();
    if (!root) {
      console.warn('[Notion PM] Could not find page root.');
      return;
    }
    slides = buildSlides(root);
    if (slides.length <= 1) {
      // If we only have the title slide, add content slides
      const all = collectTopLevelBlocks(root);
      if (all.length > 0) {
        slides.push(all);
      }
    }
    idx = getSlideIndexFromHash() ?? 0;
    ensureOverlay();
    updateNavigationPanel(); // Initialize navigation panel
    renderSlide(idx);
    attachKeyHandlers();
    blockScroll(true);
    startObserving(root);
    isActive = true;
  }

  // Add a test button to the page to verify the script is working
  function addTestButton() {
    // Remove existing button if it exists
    const existingButton = document.getElementById('notion-presentation-test-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    const testButton = document.createElement('button');
    testButton.id = 'notion-presentation-test-button';
    testButton.textContent = '🎯 Start Presentation';
    testButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      background: #2383e2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `;
    testButton.addEventListener('click', () => {
      console.log('Test button clicked - starting presentation');
      togglePresentation();
    });
    document.body.appendChild(testButton);
    
    // Hide the button after 10 seconds
    setTimeout(() => {
      if (testButton && testButton.parentNode) {
        testButton.style.opacity = '0.5';
      }
    }, 10000);
  }

  function exitPresentation() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.classList.remove(ACTIVE_CLASS);
      (overlay as HTMLElement).style.display = 'none';
      overlay.innerHTML = '';
    }
    detachKeyHandlers();
    blockScroll(false);
    stopObserving();
    isActive = false;
  }

  function resolvePageRoot(): HTMLElement | null {
    // [Inference] Notion typically renders page content in role="main".
    const selectors = ["[role='main']", 'main', "[aria-label='Page content']"];
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(selectors.join(','))
    );
    if (candidates.length > 0) {
      const scored = candidates
        .map((el) => ({
          el,
          score: el.querySelectorAll<HTMLElement>('[data-block-id]').length
        }))
        .sort((a, b) => b.score - a.score);
      return scored[0]?.el || null;
    }
    return document.body;
  }

  function collectTopLevelBlocks(root: HTMLElement): HTMLElement[] {
    const all = Array.from(
      root.querySelectorAll<HTMLElement>('[data-block-id]')
    );
    if (all.length === 0) return [];
    const inRoot = new Set(all);
    const top = all.filter((el) => {
      const parentBlock = el.parentElement?.closest('[data-block-id]');
      return !parentBlock || !inRoot.has(parentBlock as HTMLElement);
    });
    return top.filter((el) => isVisible(el));
  }

  function isVisible(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);
    return (
      rect.width >= 1 &&
      rect.height >= 1 &&
      styles.display !== 'none' &&
      styles.visibility !== 'hidden'
    );
  }

  function isSeparatorBlock(blockEl: HTMLElement): boolean {
    if (blockEl.querySelector('hr,[role="separator"]')) return true;
    const txt = (blockEl.innerText || '').trim();
    if (/^-{3,}$/.test(txt)) return true; // --- or ----
    return false;
  }

  function getDocumentTitle(): string {
    // Try to get the document title from various sources
    const pageTitle = document.title;
    
    // Try to get the main heading from the page
    const mainHeading = document.querySelector('h1, [data-block-id] h1, .notion-page-content h1');
    
    if (mainHeading && mainHeading.textContent?.trim()) {
      return mainHeading.textContent.trim();
    }
    
    // Fallback to document title, removing " - Notion" suffix if present
    if (pageTitle) {
      return pageTitle.replace(/ - Notion$/, '').trim();
    }
    
    return 'Presentation';
  }

  function createTitleSlide(): HTMLElement {
    const titleSlide = document.createElement('div');
    titleSlide.className = 'np-title-slide';
    
    const title = getDocumentTitle();
    const subtitle = 'Notion Presentation';
    
    titleSlide.innerHTML = `
      <div class="np-title-content">
        <div class="np-title-icon">🎯</div>
        <h1 class="np-title-main">${title}</h1>
        <p class="np-title-subtitle">📊 ${subtitle}</p>
      </div>
    `;
    
    return titleSlide;
  }

  function buildSlides(root: HTMLElement): HTMLElement[][] {
    const blocks = collectTopLevelBlocks(root);
    const result: HTMLElement[][] = [];
    
    // Add title slide as the first slide
    const titleSlide = createTitleSlide();
    result.push([titleSlide]);
    
    let current: HTMLElement[] = [];
    for (const block of blocks) {
      if (isSeparatorBlock(block)) {
        if (current.length > 0) result.push(current);
        current = [];
      } else {
        current.push(block);
      }
    }
    if (current.length > 0) result.push(current);
    return result.filter((arr) => arr.length > 0);
  }

  function ensureOverlay() {
    let overlay = document.getElementById(OVERLAY_ID) as
      | HTMLElement
      | null;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = '';

    const stage = document.createElement('div');
    stage.className = STAGE_CLASS;

    const slide = document.createElement('div');
    slide.className = SLIDE_CLASS;
    slide.setAttribute('role', 'document');

    const footer = document.createElement('div');
    footer.className = 'np-footer';
    footer.id = 'np-footer';

    stage.appendChild(slide);
    overlay.appendChild(stage);
    overlay.appendChild(footer);

    // Create navigation panel
    const navPanel = createNavigationPanel();
    overlay.appendChild(navPanel);

    // Create navigation toggle button
    const navToggle = document.createElement('button');
    navToggle.className = 'np-nav-toggle';
    navToggle.addEventListener('click', toggleNavigation);
    overlay.appendChild(navToggle);

    overlay.classList.add(ACTIVE_CLASS);
    overlay.style.display = 'flex';
  }

  function createNavigationPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'np-nav-panel';
    panel.id = 'np-nav-panel';
    
    const header = document.createElement('div');
    header.className = 'np-nav-header';
    header.textContent = 'Slides';
    panel.appendChild(header);
    
    return panel;
  }

  function updateNavigationPanel() {
    const panel = document.getElementById('np-nav-panel');
    if (!panel) return;
    
    // Clear existing items (except header)
    const header = panel.querySelector('.np-nav-header');
    panel.innerHTML = '';
    if (header) panel.appendChild(header);
    
    slides.forEach((slide, index) => {
      const navItem = document.createElement('button');
      navItem.className = 'np-nav-item';
      
      if (index === 0) {
        // Title slide
        navItem.classList.add('np-nav-title');
        navItem.textContent = getDocumentTitle();
      } else {
        // Content slide - try to get heading or first text
        const slideInfo = getSlideInfo(slide);
        navItem.textContent = slideInfo.title;
        
        // Add data attributes for icons
        if (slideInfo.contentType) {
          navItem.setAttribute('data-content', slideInfo.contentType);
        }
        if (slideInfo.headingLevel) {
          navItem.setAttribute('data-heading', slideInfo.headingLevel);
        }
      }
      
      if (index === idx) {
        navItem.classList.add('np-nav-current');
      }
      
      navItem.addEventListener('click', () => {
        goToSlide(index);
        updateNavigationPanel(); // Update current slide indicator
      });
      
      panel.appendChild(navItem);
    });
  }

  function getSlideInfo(slide: HTMLElement[]): { title: string; contentType?: string; headingLevel?: string } {
    for (const block of slide) {
      // Look for headings first
      const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.textContent?.trim()) {
        return {
          title: heading.textContent.trim(),
          headingLevel: heading.tagName.toLowerCase()
        };
      }
      
      // Check for specific content types
      if (block.querySelector('ul, ol')) {
        const listText = block.textContent?.trim();
        return {
          title: listText && listText.length > 50 ? listText.substring(0, 50) + '...' : (listText || 'List'),
          contentType: 'list'
        };
      }
      
      if (block.querySelector('pre, code')) {
        return {
          title: 'Code Block',
          contentType: 'code'
        };
      }
      
      if (block.querySelector('blockquote')) {
        const quoteText = block.textContent?.trim();
        return {
          title: quoteText && quoteText.length > 50 ? quoteText.substring(0, 50) + '...' : (quoteText || 'Quote'),
          contentType: 'quote'
        };
      }
      
      if (block.querySelector('img')) {
        return {
          title: 'Image',
          contentType: 'image'
        };
      }
      
      // Fallback to first text content
      const textContent = block.textContent?.trim();
      if (textContent) {
        return {
          title: textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent
        };
      }
    }
    return { title: 'Untitled Slide' };
  }

  function toggleNavigation() {
    const panel = document.getElementById('np-nav-panel');
    if (panel) {
      panel.classList.toggle('np-nav-visible');
    }
  }

  function goToSlide(slideIndex: number) {
    if (slideIndex >= 0 && slideIndex < slides.length) {
      idx = slideIndex;
      renderSlide(idx);
    }
  }

  function sanitizeClone(root: HTMLElement): HTMLElement {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    const toProcess: Node[] = [];
    while (walker.nextNode()) toProcess.push(walker.currentNode);
    for (const n of toProcess) {
      const el = n as HTMLElement;
      el.removeAttribute('contenteditable');
      el.removeAttribute('draggable');
      el.removeAttribute('spellcheck');
      el.tabIndex = -1;
      if (el.getAttribute('role') === 'menu') {
        el.remove();
      }
    }
    return root;
  }

  function renderSlide(i: number) {
    if (!slides.length) return;
    i = Math.max(0, Math.min(i, slides.length - 1));
    idx = i;
    const overlay = document.getElementById(OVERLAY_ID) as
      | HTMLElement
      | null;
    if (!overlay) return;
    const stage = overlay.querySelector(`.${STAGE_CLASS}`) as
      | HTMLElement
      | null;
    const slide = overlay.querySelector(`.${SLIDE_CLASS}`) as
      | HTMLElement
      | null;
    const footer = overlay.querySelector('#np-footer') as
      | HTMLElement
      | null;
    if (!stage || !slide || !footer) return;

    slide.innerHTML = '';
    for (const block of slides[i]) {
      const clone = block.cloneNode(true) as HTMLElement;
      sanitizeClone(clone);
      slide.appendChild(clone);
    }
    footer.innerHTML = `📄 Slide ${i + 1} / ${slides.length}`;
    updateHash(i);
    updateNavigationPanel(); // Update navigation panel when slide changes
  }

  function next() {
    if (idx < slides.length - 1) {
      renderSlide(idx + 1);
    }
  }

  function prev() {
    if (idx > 0) {
      renderSlide(idx - 1);
    }
  }

  function onKey(e: KeyboardEvent) {
    const overlay = document.getElementById(OVERLAY_ID) as
      | HTMLElement
      | null;
    if (!overlay || overlay.style.display === 'none') return;

    const code = e.code;
    if (code === 'ArrowRight' || code === 'Space') {
      e.preventDefault();
      e.stopPropagation();
      next();
      return;
    }
    if (code === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      prev();
      return;
    }
    if (code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      exitPresentation();
      return;
    }
    if (code === 'PageDown') {
      e.preventDefault();
      next();
      return;
    }
    if (code === 'PageUp') {
      e.preventDefault();
      prev();
      return;
    }
    if (!e.ctrlKey && !e.metaKey && !e.altKey && code === 'KeyR') {
      e.preventDefault();
      rescanAndRender();
    }
    if (code === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      toggleNavigation();
      return;
    }
  }

  function attachKeyHandlers() {
    keyHandlerBound = onKey;
    window.addEventListener('keydown', keyHandlerBound, true);
  }

  function detachKeyHandlers() {
    if (keyHandlerBound) {
      window.removeEventListener('keydown', keyHandlerBound, true);
      keyHandlerBound = null;
    }
  }

  function blockScroll(enable: boolean) {
    const html = document.documentElement;
    const body = document.body;
    if (enable) {
      html.classList.add('np-block-scroll');
      body.classList.add('np-block-scroll');
    } else {
      html.classList.remove('np-block-scroll');
      body.classList.remove('np-block-scroll');
    }
  }

  function updateHash(i: number) {
    try {
      const url = new URL(window.location.href);
      url.hash = `slide-${i + 1}`;
      history.replaceState(history.state, '', url.toString());
    } catch {
      // ignore
    }
  }

  function getSlideIndexFromHash(): number | null {
    const m = window.location.hash.match(/slide-(\d+)/i);
    if (!m) return null;
    const n = Math.max(1, parseInt(m[1], 10));
    return n - 1;
  }

  function debounced<T extends (...args: any[]) => void>(
    fn: T,
    ms: number
  ) {
    let t: number | null = null;
    return (...args: Parameters<T>) => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => fn(...args), ms);
    };
  }

  function startObserving(root: HTMLElement) {
    stopObserving();
    observer = new MutationObserver(
      debounced(() => {
        if (!isActive) return;
        rescanAndRender();
      }, 300)
    );
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function rescanAndRender() {
    const root = resolvePageRoot();
    if (!root) return;
    slides = buildSlides(root);
    if (slides.length === 0) {
      slides = [collectTopLevelBlocks(root)];
    }
    idx = Math.min(idx, slides.length - 1);
    renderSlide(idx);
  }
})();

} // End of Notion page check