import '@testing-library/jest-dom';

// Mock Chrome APIs
const mockChrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
  tabs: {
    sendMessage: jest.fn(),
    query: jest.fn(),
  },
  action: {
    onClicked: {
      addListener: jest.fn(),
    },
  },
  commands: {
    onCommand: {
      addListener: jest.fn(),
    },
  },
  scripting: {
    executeScript: jest.fn(),
  },
};

// @ts-ignore
global.chrome = mockChrome;

// Mock DOM APIs that might not be available in test environment
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'block',
    visibility: 'visible',
  }),
});

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor(callback: MutationCallback) {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
};

// Mock history API
Object.defineProperty(window, 'history', {
  value: {
    replaceState: jest.fn(),
    state: {},
  },
  writable: true,
});

// Mock location API
Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    href: 'https://notion.so/test',
  },
  writable: true,
});
