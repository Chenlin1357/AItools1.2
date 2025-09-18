// 应用配置
const Config = {
  // API配置
  API: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:3000',
    TIMEOUT: 10000
  },

  // 功能开关
  FEATURES: {
    VOICE_SEARCH: true,
    FILE_UPLOAD: true,
    OFFLINE_MODE: true
  },

  // 本地存储键名
  STORAGE_KEYS: {
    USER_PREFERENCES: 'user_preferences',
    RECENT_SEARCHES: 'recent_searches',
    CHALLENGE_PROGRESS: 'challenge_progress'
  },

  // 默认设置
  DEFAULTS: {
    MODE: 'guide',
    LANGUAGE: 'zh-CN',
    THEME: 'light'
  },

  // 方言映射
  DIALECT_MAP: {
    '整图': '文生图',
    '搞段视频': '文生视频',
    '整首歌': '文生音乐',
    '脑图': '思维导图',
    '帮手': 'AI助手',
    '改作业': '批改作业',
    '整视频': '文生视频',
    '整音乐': '文生音乐'
  }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
} else {
  window.Config = Config;
}