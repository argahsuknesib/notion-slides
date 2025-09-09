// Utility functions extracted from content.ts for testing
export function collectTopLevelBlocks(root: HTMLElement): HTMLElement[] {
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

export function isVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const styles = window.getComputedStyle(el);
  return (
    rect.width >= 1 &&
    rect.height >= 1 &&
    styles.display !== 'none' &&
    styles.visibility !== 'hidden'
  );
}

export function isSeparatorBlock(blockEl: HTMLElement): boolean {
  if (blockEl.querySelector('hr,[role="separator"]')) return true;
  const txt = (blockEl.innerText || '').trim();
  if (/^-{3,}$/.test(txt)) return true; // --- or ----
  return false;
}

export function buildSlides(root: HTMLElement): HTMLElement[][] {
  const blocks = collectTopLevelBlocks(root);
  const result: HTMLElement[][] = [];
  
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

export function getDocumentTitle(): string {
  // Try to get the document title from various sources
  const pageTitle = document.title;
  if (pageTitle && pageTitle !== 'Notion') {
    return pageTitle;
  }
  
  // Try to find main heading
  const mainHeading = document.querySelector('h1, [data-block-id] h1, .notion-page-content h1');
  if (mainHeading?.textContent) {
    return mainHeading.textContent.trim();
  }
  
  return 'Untitled';
}

export function createTitleSlide(): HTMLElement {
  const title = getDocumentTitle();
  const titleSlide = document.createElement('div');
  titleSlide.className = 'np-title-slide';
  titleSlide.innerHTML = `
    <div class="np-title-content">
      <h1 class="np-title-main">${title}</h1>
    </div>
  `;
  return titleSlide;
}
