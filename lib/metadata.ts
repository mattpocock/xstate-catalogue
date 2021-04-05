import * as Icons from './Icons';

export interface MetadataItem {
  title: string;
  icon: keyof typeof Icons;
  version: string;
}

export const metadata: Record<string, MetadataItem> = {
  authentication: {
    title: 'Authentication',
    icon: 'LockOpenOutlined',
    version: '0.0.0',
  },
  'confirmation-dialog': {
    title: 'Confirmation Dialog',
    icon: 'PlaylistAddCheckOutlined',
    version: '0.0.0',
  },
  'create-or-update-form': {
    title: 'Create Or Update Form',
    icon: 'ContactSupportOutlined',
    version: '0.0.0',
  },
  debounce: {
    title: 'Debounce',
    icon: 'ReplyOutlined',
    version: '0.0.0',
  },
  deduplication: {
    title: 'Deduplication',
    icon: 'ReplyAllOutlined',
    version: '0.0.0',
  },
  'drag-and-drop': {
    title: 'Drag And Drop',
    icon: 'PanToolOutlined',
    version: '0.1.0',
  },
  'form-input': {
    title: 'Form Input',
    icon: 'EditOutlined',
    version: '0.0.0',
  },
  'infinite-scroll': {
    title: 'Infinite Scroll',
    icon: 'AllInclusiveOutlined',
    version: '0.0.0',
  },
  'multi-step-form': {
    title: 'Multi-Step Form',
    icon: 'DynamicFeedOutlined',
    version: '0.1.0',
  },
  'multi-step-form-with-validation': {
    title: 'Multi-Step Form With Validation',
    icon: 'DynamicFeedOutlined',
    version: '0.1.0',
  },
  'multi-step-timer': {
    title: 'Multi-Step Timer',
    icon: 'AvTimerOutlined',
    version: '0.0.0',
  },
  'netflix-style-video-hover': {
    title: 'Netflix-style Video Hover',
    icon: 'MovieFilterOutlined',
    version: '0.1.0',
  },
  pagination: {
    title: 'Pagination',
    icon: 'LastPageOutlined',
    version: '0.0.0',
  },
  queue: {
    title: 'Offline Queue',
    icon: 'BackupOutlined',
    version: '0.0.0',
  },
  'simple-data-fetch': {
    title: 'Simple Data Fetch',
    icon: 'KeyboardReturnOutlined',
    version: '0.0.0',
  },
  'with-local-cache': {
    title: 'Data fetch with local cache',
    icon: 'KeyboardReturnOutlined',
    version: '0.0.3',
  },
  'tab-focus': {
    title: 'Tab Focus',
    icon: 'TabOutlined',
    version: '0.1.0',
  },
  // "video-audio-controls": {
  //   title: "Video / Audio Controls",
  //   icon: "PlayCircleOutlineOutlined",
  //   version: "0.0.0",
  // },
  // "circuit-breaker": {
  //   title: "With Circuit Breaker",
  //   icon: "BatteryAlertOutlined",
  //   version: "0.0.0",
  // },
};
