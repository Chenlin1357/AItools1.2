class FileUploader {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 为需要文件上传功能的页面添加监听器
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('upload-trigger')) {
        this.openFilePicker();
      }
    });
  }

  openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx,.txt';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    };
    
    input.click();
  }

  async handleFileUpload(file) {
    try {
      Utils.showNotification(`正在上传: ${file.name}`, 'info');
      
      const result = await apiClient.uploadFile(file);
      
      Utils.showNotification('文件上传成功!', 'success');
      console.log('上传结果:', result);
      
      // 触发文件上传成功事件
      this.onUploadSuccess && this.onUploadSuccess(result, file);
      
    } catch (error) {
      Utils.showNotification('文件上传失败', 'error');
      console.error('上传错误:', error);
    }
  }

  onUploadSuccess(callback) {
    this.onUploadSuccess = callback;
  }
}

// 初始化文件上传器
window.fileUploader = new FileUploader();