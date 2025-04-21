const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const app = express();
const PORT = 3000;

// 使用JSON适配器
const adapter = new FileSync('db.json');
const db = low(adapter);

// 初始化数据库
db.defaults({ users: [], messages: [], photos: [] }).write();

// 解析JSON请求体
app.use(express.json());

// 用户数据
const users = [
    { id: 1, username: 'zhuha', password: 'zhuha106424', role: 'admin' },
    { id: 2, username: 'test1', password: 'test1', role: 'user' },
    { id: 3, username: 'test2', password: 'test2', role: 'user' }
];

// 登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

// 获取个人信息
app.get('/api/profile', (req, res) => {
    const { userId } = req.query;
    const user = users.find(u => u.id === parseInt(userId));

    if (user) {
        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
        res.status(404).json({ success: false, message: '用户未找到' });
    }
});

// 更新个人信息
app.put('/api/profile', (req, res) => {
    const { userId, username } = req.body;
    const userIndex = users.findIndex(u => u.id === parseInt(userId));

    if (userIndex !== -1) {
        users[userIndex].username = username;
        res.json({ success: true, user: users[userIndex] });
    } else {
        res.status(404).json({ success: false, message: '用户未找到' });
    }
});

// 获取消息
app.get('/api/messages', (req, res) => {
    res.json({ success: true, messages: db.get('messages').value() });
});

// 发送消息
app.post('/api/messages', (req, res) => {
    const { sender, content } = req.body;
    const message = { id: Date.now(), sender, content, timestamp: new Date().toISOString() };
    db.get('messages').push(message).write();
    res.json({ success: true, message });
});

// 获取相册分类和照片
app.get('/api/photos', (req, res) => {
    res.json({ success: true, photos: db.get('photos').value() });
});

// 上传照片
app.post('/api/photos', (req, res) => {
    const { title, description, album, url } = req.body;
    const photo = { id: Date.now(), title, description, album, url, timestamp: new Date().toISOString() };
    db.get('photos').push(photo).write();
    res.json({ success: true, photo });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
