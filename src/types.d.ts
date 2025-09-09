// Type definitions for Chrome Extension APIs
declare namespace chrome {
  namespace commands {
    interface CommandsAPI {
      onCommand: {
        addListener(callback: (command: string) => void): void;
      };
    }
  }
  
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }
    
    interface TabsAPI {
      query(queryInfo: { active?: boolean; currentWindow?: boolean }): Promise<Tab[]>;
      sendMessage(tabId: number, message: any): void;
    }
  }
  
  namespace action {
    interface ActionAPI {
      onClicked: {
        addListener(callback: (tab: tabs.Tab) => void): void;
      };
    }
  }
  
  namespace runtime {
    interface RuntimeAPI {
      onMessage: {
        addListener(callback: (message: any) => void): void;
      };
    }
  }
  
  const commands: commands.CommandsAPI;
  const tabs: tabs.TabsAPI;
  const action: action.ActionAPI;
  const runtime: runtime.RuntimeAPI;
}

declare const chrome: typeof chrome;
