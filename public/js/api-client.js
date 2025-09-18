class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }

  // 生成教学资源
  async generateResource(resourceData) {
    return this.request('/api/resources/generate', {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  }

  // 上传文件
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {} // 让浏览器自动设置Content-Type
    });
  }
}

// 创建全局API客户端实例
window.apiClient = new APIClient();