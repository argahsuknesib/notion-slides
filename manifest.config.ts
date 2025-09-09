import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Notion Slides',
  description: 'Transform your Notion pages into beautiful presentation slides with automatic slide separation and navigation.',
  version: '1.0.0',
  icons: {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
  },
  action: {
    default_title: 'Start Notion Presentation',
    default_icon: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png'
    }
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module'
  },
  commands: {
    'toggle-presentation': {
      suggested_key: {
        default: 'Alt+Shift+P',
        mac: 'Alt+Shift+P'
      },
      description: 'Toggle Notion presentation mode'
    }
  },
  host_permissions: [
    'https://www.notion.so/*',
    'https://notion.so/*',
    'https://*.notion.site/*',
    'https://*.notion.so/*'
  ],
  content_scripts: [
    {
      matches: [
        'https://www.notion.so/*',
        'https://notion.so/*',
        'https://*.notion.site/*',
        'https://*.notion.so/*'
      ],
      js: ['src/content.ts'],
      run_at: 'document_idle'
    }
  ],
  permissions: ['scripting']
});