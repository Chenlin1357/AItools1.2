class AIWorkshopApp {
  constructor() {
    this.currentMode = 'guide';
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadInitialData();
    this.setupVoiceRecognition();
  }

  bindEvents() {
    // 模式切换
    document.getElementById('guideMode').addEventListener('click', () => this.switchMode('guide'));
    document.getElementById('selfMode').addEventListener('click', () => this.switchMode('self'));

    // 功能按钮
    document.querySelectorAll('.feature-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.textContent;
        this.handleFeatureClick(type);
      });
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch(searchInput.value);
      }
    });

    // 语音搜索按钮
    document.querySelector('.voice-btn').addEventListener('click', () => {
      this.startVoiceSearch();
    });
  }

  async loadInitialData() {
    try {
      const [tools, challenges] = await Promise.all([
        apiClient.getAITools(),
        apiClient.getChallenges()
      ]);
      
      this.updateToolsDisplay(tools);
      this.updateChallengesDisplay(challenges);
    } catch (error) {
      console.error('加载初始数据失败:', error);
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    const isGuideMode = mode === 'guide';
    
    // 更新按钮样式
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.style.background = '#eee';
      btn.style.color = '#666';
    });
    
    const targetBtn = document.getElementById(`${mode}Mode`);
    targetBtn.style.background = isGuideMode ? '#3498db' : '#2ecc71';
    targetBtn.style.color = 'white';
    
    // 更新页面样式
    document.body.style.backgroundColor = isGuideMode ? '#e3f2fd' : '#f8f9fa';
    
    // 显示/隐藏引导元素
    this.toggleGuidance(isGuideMode);
    
    Utils.showNotification(`已切换到${isGuideMode ? '引领模式' : '自主学习模式'}`, 'success');
  }

  toggleGuidance(show) {
    const guidanceElements = document.querySelectorAll('.guidance-hint');
    guidanceElements.forEach(el => {
      el.style.display = show ? 'block' : 'none';
    });
  }

  async handleFeatureClick(featureType) {
    switch(featureType) {
      case '成长挑战系统':
        await this.showChallengeSystem();
        break;
      case 'AI能力矩阵手册':
        await this.showMatrixManual();
        break;
      case '资源工厂':
        await this.showResourceFactory();
        break;
      case '文生图':
      case 'AI创意写作':
      case 'AI整理文档':
      case 'AI思维导图':
        this.showSpecialPage(featureType);
        break;
      default:
        console.log('未知功能:', featureType);
    }
  }

  async showChallengeSystem() {
    try {
      const challenges = await apiClient.getChallenges();
      this.updateChallengesDisplay(challenges);
      Utils.showNotification('挑战数据加载成功', 'success');
    } catch (error) {
      Utils.showNotification('加载挑战数据失败', 'error');
    }
  }

  async showMatrixManual() {
    try {
      const tools = await apiClient.getAITools();
      this.updateToolsDisplay(tools);
      Utils.showNotification('AI能力矩阵加载成功', 'success');
    } catch (error) {
      Utils.showNotification('加载能力矩阵失败', 'error');
    }
  }

  async showResourceFactory() {
    // 资源工厂逻辑已在HTML中实现
    Utils.showNotification('资源工厂已打开', 'info');
  }

  showSpecialPage(pageType) {
    // 特殊页面的显示逻辑
    const pageId = this.getPageIdFromType(pageType);
    this.showSection(pageId);
    Utils.showNotification(`${pageType}页面已打开`, 'info');
  }

  getPageIdFromType(type) {
    const map = {
      '创建智能体': 'createAgent',
      'AI批改作业': 'aiGrading',
      '文生视频': 'textToVideo',
      '文生音乐': 'textToMusic'
    };
    return map[type];
  }

  showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
      section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
    }
  }

  async handleSearch(query) {
    if (!query.trim()) return;
    
    try {
      const result = await apiClient.dialectSearch(query);
      this.displaySearchResults(result);
    } catch (error) {
      Utils.showNotification('搜索失败', 'error');
    }
  }

  displaySearchResults(result) {
    const resultsContainer = document.createElement('div');
    resultsContainer.innerHTML = `
      <h3>搜索结果: "${result.normalized}"</h3>
      ${result.results.map(item => `
        <div class="search-result-item">
          <h4>${item.title}</h4>
          <p>相关度: ${Math.round(item.relevance * 100)}%</p>
        </div>
      `).join('')}
    `;
    
    Utils.showNotification(`找到${result.results.length}个结果`, 'success');
  }

  setupVoiceRecognition() {
    voiceRecognition.onStart(() => {
      Utils.showNotification('正在聆听...', 'info');
    });

    voiceRecognition.onResult((transcript) => {
      document.getElementById('searchInput').value = transcript;
      this.handleSearch(transcript);
    });

    voiceRecognition.onError((error) => {
      Utils.showNotification(`语音识别错误: ${error}`, 'error');
    });
  }

  startVoiceSearch() {
    voiceRecognition.start();
  }

  updateToolsDisplay(tools) {
    // 更新工具显示逻辑
    console.log('更新工具显示:', tools);
  }

  updateChallengesDisplay(challenges) {
    // 更新挑战显示逻辑
    console.log('更新挑战显示:', challenges);
  }
}

// 视频控制函数
function playVideo(videoId) {
    const video = document.getElementById(videoId);
    if (video) {
        video.play().catch(error => {
            console.error('播放失败:', error);
            if (window.Utils && window.Utils.showNotification) {
                Utils.showNotification('视频播放失败，请检查文件路径', 'error');
            }
        });
    }
}

function pauseVideo(videoId) {
    const video = document.getElementById(videoId);
    if (video) {
        video.pause();
    }
}

function toggleFullscreen(videoId) {
    const video = document.getElementById(videoId);
    if (video) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    }
}

// 显示功能指导
function showGuide(card) {
    const module = card.getAttribute('data-module');
    
    // 根据模块类型显示不同的指导内容
    const guides = {
        'text2img': {
            title: '文生图功能指导',
            content: '上传图片或输入描述，选择艺术风格，生成您想要的图像。支持水墨、油画、像素等多种风格。'
        },
        'text2video': {
            title: 'AI创意写作指导',
            content: '输入主题或关键词，选择写作风格，生成创意内容。适用于文章、故事、诗歌等多种文体。'
        },
        'text2music': {
            title: 'AI文档整理指导',
            content: '上传文档或输入内容，选择整理方式，获得优化后的文档。支持智能分类、排版与格式优化。'
        },
        'mindmap': {
            title: 'AI思维导图指导',
            content: '输入中心主题，添加分支节点，自动生成结构化思维导图。支持智能关联与知识图谱生成。'
        }
    };
    
    const guide = guides[module] || { 
        title: '功能指导', 
        content: '该功能指导正在准备中...' 
    };
    
    // 显示模态框
    document.getElementById('modalTitle').textContent = guide.title;
    document.getElementById('modalContent').textContent = guide.content;
    document.getElementById('guideModal').style.display = 'flex';
}

// 关闭模态框
function closeModal() {
    document.getElementById('guideModal').style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('guideModal');
    if (event.target === modal) {
        closeModal();
    }
};

// 语音识别函数（示例）
function startVoiceRecognition() {
    alert('语音识别功能已启动，请开始说话...');
    // 实际实现需要调用Web Speech API
}

// 打开AI聊天函数（示例）
function openAIChat() {
    alert('AI聊天功能即将打开...');
    // 实际实现需要打开聊天界面
}

// 统一的DOMContentLoaded事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 1. 初始化视频错误处理
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.error('视频加载失败:', video.src);
            if (window.Utils && window.Utils.showNotification) {
                Utils.showNotification('视频加载失败，请检查文件是否存在', 'error');
            }
            
            // 显示备用内容
            const videoContainer = video.parentElement;
            if (videoContainer) {
                videoContainer.innerHTML = `
                    <div class="video-fallback">
                        <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                        <h3>视频加载失败</h3>
                        <p>请确保视频文件位于 uploads/ 文件夹中</p>
                        <p>支持的格式: MP4, WebM, OGG</p>
                        <button onclick="location.reload()">重新加载</button>
                    </div>
                `;
            }
        });
        
        video.addEventListener('loadeddata', function() {
            console.log('视频加载成功:', video.src);
        });
    });

    // 2. 初始化应用
    window.app = new AIWorkshopApp();
    
    console.log('AI创意工坊应用初始化完成');
});