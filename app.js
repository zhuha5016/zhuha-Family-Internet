/* ===== 数据 ===== */
let members = JSON.parse(localStorage.getItem('family_members') || "[]");
let devices = JSON.parse(localStorage.getItem('family_devices') || "[]");
let events  = JSON.parse(localStorage.getItem('family_events') || "[]");

/* ===== 登录 ===== */
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'zhuha' && pass === 'zhuha106424') {
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.main-container').style.display = 'block';
        document.getElementById('current-username').innerText = user;
        document.getElementById('welcome-username').innerText = user;
        document.querySelector('.user-avatar').innerText = user.charAt(0);
    } else {
        document.getElementById('errorMsg').style.display = 'block';
    }
});

/* ===== 导出 ===== */
function exportData() {
    const data = { members, devices, events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'family_backup.json';
    a.click();
}

/* ===== 导入 ===== */
function importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const d = JSON.parse(e.target.result);
        members = d.members || [];
        devices = d.devices || [];
        events = d.events || [];
        localStorage.setItem('family_members', JSON.stringify(members));
        localStorage.setItem('family_devices', JSON.stringify(devices));
        localStorage.setItem('family_events', JSON.stringify(events));
        alert('导入成功，刷新页面生效');
    };
    reader.readAsText(file);
}

/* ===== 重置 ===== */
function resetAll() {
    if (confirm('确定清空所有数据？')) {
        localStorage.clear();
        location.reload();
    }
}

/* ===== 日期 ===== */
document.getElementById('current-date').innerText =
    new Date().toLocaleDateString('zh-CN', { year:'numeric', month:'long', day:'numeric' });
