const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));  // 允许访问当前目录

// 根路径路由 - 服务主页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 其他页面路由
app.get('/create-agent', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ai-grading', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/text-to-video', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/text-to-music', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ai-course', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Multer配置用于文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 文件上传接口
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有文件上传' });
  }
  
  res.json({
    message: '文件上传成功',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// 生成教学资源接口
app.post('/api/resources/generate', (req, res) => {
  const { type, grade, subject, topic } = req.body;
  
  // 模拟资源生成过程
  setTimeout(() => {
    const resource = {
      id: Date.now(),
      type,
      grade,
      subject,
      topic,
      title: `${subject} - ${topic} ${getResourceTypeName(type)}`,
      content: generateResourceContent(type, grade, subject, topic),
      createdAt: new Date().toISOString()
    };
    
    res.json(resource);
  }, 2000);
});

// 辅助函数
function getResourceTypeName(type) {
  const types = {
    'lessonPlan': '教案设计',
    'worksheet': '学习工作纸',
    'activity': '课堂活动',
    'assessment': '评估材料'
  };
  return types[type] || '教学资源';
}

function generateResourceContent(type, grade, subject, topic) {
  // 根据类型生成不同的资源内容
  const templates = {
    lessonPlan: `# ${subject}教案：${topic}
    
## 教学目标
1. 理解${topic}的基本概念
2. 掌握相关技能和方法
3. 能够应用所学知识解决问题

## 教学流程
1. 导入（5分钟）
2. 讲解（15分钟）
3. 练习（15分钟）
4. 总结（5分钟）

## 评估方式
- 课堂参与度
- 练习完成情况
- 小组合作表现`,

    worksheet: `# ${subject}学习工作纸：${topic}
    
## 基础知识
1. 关键概念：__________
2. 重要公式：__________
3. 注意事项：__________

## 练习题
1. 基础题：__________
2. 应用题：__________
3. 拓展题：__________

## 自我评估
□ 完全掌握 □ 基本掌握 □ 需要加强`,

    activity: `# ${subject}课堂活动：${topic}
    
## 活动目标
通过互动游戏加深对${topic}的理解

## 活动准备
- 分组：4-5人一组
- 材料：任务卡片、计时器
- 时间：20分钟

## 活动流程
1. 介绍规则（2分钟）
2. 小组活动（15分钟）
3. 成果展示（3分钟)`,

    assessment: `# ${subject}评估材料：${topic}
    
## 评估标准
- 优秀：90-100分
- 良好：80-89分
- 合格：60-79分
- 需改进：60分以下

## 测试题目
选择题（40分）
简答题（40分）
应用题（20分）`
  };

  return templates[type] || '资源内容生成中...';
}

// 图片服务路由
app.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    
    // 验证请求的图片是否在允许的列表中
    const allowedImages = [
        'AICOURSE1.jpg', 'AICOURSE2.jpg', 'AICOURSE3.jpg', 
        'AICOURSE4.jpg', 'AICOURSE5.jpg', 'AICOURSE6.jpg',
        'AICOURSE7.jpg', 'AICOURSE8.jpg', 'AICOURSE9.jpg',
        'HOMEWORK1.png','HOMEWORK2.png','HOMEWORK3.png',
        'KNOWLEDGE1.png','KNOWLEDGE2.png','KNOWLEDGE3.png',
        'QUESTION1.png','QUESTION2.png','QUESTION3.png','QUESTION4.png'
    ];
    
    if (!allowedImages.includes(imageName)) {
        return res.status(404).send('图片未找到');
    }
    
    const imagePath = path.join(__dirname, 'uploads', imageName);
    
    // 检查图片是否存在
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('图片不存在:', imagePath);
            return res.status(404).send('图片不存在');
        }
        
        // 发送图片文件
        res.sendFile(imagePath, (err) => {
            if (err) {
                console.error('发送图片出错:', err);
                res.status(500).send('服务器错误');
            }
        });
    });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});