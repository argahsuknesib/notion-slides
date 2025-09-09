import '../test/setup';

describe('Background Script', () => {
  beforeEach(() => {
    // Reset chrome API mocks
    jest.clearAllMocks();
  });

  describe('Chrome Extension APIs', () => {
    it('should have chrome runtime API available', () => {
      expect(chrome.runtime).toBeDefined();
      expect(chrome.runtime.onMessage).toBeDefined();
    });

    it('should have chrome tabs API available', () => {
      expect(chrome.tabs).toBeDefined();
      expect(chrome.tabs.sendMessage).toBeDefined();
      expect(chrome.tabs.query).toBeDefined();
    });

    it('should have chrome action API available', () => {
      expect(chrome.action).toBeDefined();
      expect(chrome.action.onClicked).toBeDefined();
    });

    it('should have chrome commands API available', () => {
      expect(chrome.commands).toBeDefined();
      expect(chrome.commands.onCommand).toBeDefined();
    });
  });

  describe('Message Handling', () => {
    it('should be able to add message listeners', () => {
      const mockListener = jest.fn();
      chrome.runtime.onMessage.addListener(mockListener);
      
      expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(mockListener);
    });

    it('should be able to send messages to tabs', async () => {
      const mockMessage = { type: 'TOGGLE_PRESENTATION' };
      const tabId = 123;
      
      (chrome.tabs.sendMessage as jest.Mock).mockResolvedValue({ success: true });
      
      await chrome.tabs.sendMessage(tabId, mockMessage);
      
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(tabId, mockMessage);
    });
  });

  describe('Action Clicks', () => {
    it('should be able to add action click listeners', () => {
      const mockListener = jest.fn();
      chrome.action.onClicked.addListener(mockListener);
      
      expect(chrome.action.onClicked.addListener).toHaveBeenCalledWith(mockListener);
    });
  });

  describe('Keyboard Commands', () => {
    it('should be able to add command listeners', () => {
      const mockListener = jest.fn();
      chrome.commands.onCommand.addListener(mockListener);
      
      expect(chrome.commands.onCommand.addListener).toHaveBeenCalledWith(mockListener);
    });
  });
});
