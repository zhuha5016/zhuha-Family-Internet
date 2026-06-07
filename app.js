const DB_KEYS = {
            members: 'family_members',
            devices: 'family_devices',
            events: 'family_events',
            todos: 'family_todos'
        };

        function loadData(key, defaultVal) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultVal;
        }

        function saveData(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }

        let members = loadData(DB_KEYS.members, [
            { name: '张三', role: '管理员', phone: '138****0001' },
            { name: '李四', role: '高级成员', phone: '139****0002' },
            { name: '王五', role: '普通成员', phone: '137****0003' }
        ]);
        
        let devices = loadData(DB_KEYS.devices, [
            { id: 1, name: '客厅灯光', location: '客厅', on: true },
            { id: 2, name: '卧室灯光', location: '卧室', on: false },
            { id: 3, name: '空调', location: '客厅', on: false }
        ]);
        
        let events = loadData(DB_KEYS.events, [
            { date: '2025-01-21', title: '家庭会议', time: '14:30', location: '客厅' },
            { date: '2025-01-22', title: '李四医生预约', time: '09:00', location: '人民医院' }
        ]);

        let todos = loadData(DB_KEYS.todos, []);
        
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        // ==================== UI 渲染函数 ====================
        function renderAll() {
            renderMembers();
            renderDevices();
            renderHomeSummary();
            renderTodos();
            renderCalendar();
        }
        
        function renderMembers() {
            const ul = document.getElementById('memberList');
            const homeUl = document.getElementById('homeMemberList');
            ul.innerHTML = members.map((m, i) => `
                <li class="member-item">
                    <div class="member-avatar">${m.name.charAt(0)}</div>
                    <div class="member-info"><h4>${m.name}</h4><p>${m.role}</p></div>
                    <div class="member-actions"><button class="delete-btn" onclick="deleteMember(${i})">删除</button></div>
                </li>
            `).join('');
            homeUl.innerHTML = members.slice(0, 3).map(m => `<div>${m.name} (${m.role})</div>`).join('');
            document.getElementById('memberNum').innerText = `${members.length}位成员`;
            saveData(DB_KEYS.members, members);
        }
        
        function renderDevices() {
            const grid = document.getElementById('deviceGrid');
            const homeSummary = document.getElementById('homeDeviceSummary');
            grid.innerHTML = devices.map(d => `
                <div class="device-item">
                    <div class="device-header"><h4>${d.name}</h4>
                        <label class="device-toggle">
                            <input type="checkbox" ${d.on ? 'checked' : ''} onchange="toggleDevice(${d.id}, this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="device-status ${d.on ? '' : 'off'}">${d.on ? '已开启' : '已关闭'}</div>
                </div>
            `).join('');
            
            const onCount = devices.filter(d => d.on).length;
            homeSummary.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>客厅灯光</span><span class="device-status ${devices.find(d=>d.name.includes('客厅'))?.on ? '' : 'off'}">${devices.find(d=>d.name.includes('客厅'))?.on ? '已开启' : '已关闭'}</span></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;"><span>空调</span><span class="device-status ${devices.find(d=>d.name.includes('空调'))?.on ? '' : 'off'}">${devices.find(d=>d.name.includes('空调'))?.on ? '已开启' : '已关闭'}</span></div>
            `;
            document.getElementById('deviceStatusText').innerText = `${onCount}/${devices.length} 已开启`;
            saveData(DB_KEYS.devices, devices);
        }
        
        function renderHomeSummary() {
            document.getElementById('homeScheduleList').innerHTML = events.slice(0, 2).map(e => `
                <div class="schedule-item"><div class="schedule-time">${e.date} ${e.time}</div><div class="schedule-title">${e.title}</div></div>
            `).join('') || '<p style="color:#999">暂无日程</p>';
            document.getElementById('scheduleNum').innerText = `${events.length}个日程`;
        }

        function renderTodos() {
            const ul = document.getElementById('todoList');
            ul.innerHTML = todos.map((t, i) => `
                <li style="display:flex; align-items:center; gap:8px; padding: 5px 0; border-bottom: 1px dashed #eee;">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTodo(${i})">
                    <span style="${t.done ? 'text-decoration: line-through; color: #999;' : ''}">${t.text}</span>
                </li>
            `).join('');
            document.getElementById('todoCount').innerText = todos.filter(t => !t.done).length;
            saveData(DB_KEYS.todos, todos);
        }
        
        function renderCalendar() {
            const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            document.getElementById('calendarMonth').innerText = `${currentYear}年 ${monthNames[currentMonth]}`;
            
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            let html = '';
            
            for(let i = 0; i < firstDay; i++) html += '<div class="calendar-day"></div>';
            
            for(let i = 1; i <= daysInMonth; i++) {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                const hasEvent = events.some(e => e.date === dateStr);
                const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, i).toDateString();
                html += `<div class="calendar-day ${hasEvent ? 'has-event' : ''} ${isToday ? 'today' : ''}">${i}</div>`;
            }
            document.getElementById('calendarBody').innerHTML = html;
            saveData(DB_KEYS.events, events);
        }

        // ==================== 交互逻辑 ====================
        function login(e) {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if (user === 'zhuha' && pass === 'zhuha106424') {
                document.querySelector('.login-container').style.display = 'none';
                document.querySelector('.main-container').style.display = 'block';
                document.getElementById('currentUser').innerText = user;
                document.getElementById('welcomeUser').innerText = user;
                document.getElementById('userAvatar').innerText = user.charAt(0);
                document.getElementById('profileAvatar').innerText = user.charAt(0);
                document.getElementById('profileName').innerText = user;
                renderAll();
            } else {
                document.getElementById('errorMsg').style.display = 'block';
                document.getElementById('errorMsg').innerText = '用户名或密码错误';
            }
        }
        
        function showSection(id) {
            document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
            document.getElementById(id).style.display = 'block';
            document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
            event.target.classList.add('active');
        }
        
        function showModal(id) {
            document.getElementById(id).style.display = 'flex';
        }
        
        function closeModal(id) {
            document.getElementById(id).style.display = 'none';
        }
        
        function saveMember() {
            const name = document.getElementById('memberName').value;
            if (!name) return alert('请输入姓名');
            members.push({ name, role: document.getElementById('memberRole').value, phone: document.getElementById('memberPhone').value });
            renderMembers();
            closeModal('add-member-modal');
        }
        
        function deleteMember(index) {
            if (confirm('确定删除该成员？')) {
                members.splice(index, 1);
                renderMembers();
            }
        }
        
        function saveDevice() {
            const name = document.getElementById('deviceName').value;
            if (!name) return alert('请输入设备名称');
            devices.push({ id: Date.now(), name, location: document.getElementById('deviceLocation').value, on: false });
            renderDevices();
            closeModal('add-device-modal');
        }
        
        function toggleDevice(id, status) {
            const device = devices.find(d => d.id === id);
            if (device) device.on = status;
            renderDevices();
        }
        
        function saveEvent() {
            const title = document.getElementById('eventTitle').value;
            const date = document.getElementById('eventDate').value;
            if (!title || !date) return alert('请填写完整信息');
            events.push({ title, date, time: document.getElementById('eventTime').value, location: '' });
            renderAll();
            closeModal('add-event-modal');
        }
        
        function addTodo() {
            const input = document.getElementById('todoInput');
            if (!input.value.trim()) return;
            todos.push({ text: input.value, done: false });
            input.value = '';
            renderTodos();
        }
        
        function toggleTodo(index) {
            todos[index].done = !todos[index].done;
            renderTodos();
        }
        
        function changeMonth(delta) {
            currentMonth += delta;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar();
        }
        
        // ==================== 数据迁移 ====================
        function exportData() {
            const data = { members, devices, events, todos };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'family_backup.json';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.members) members = data.members;
                    if (data.devices) devices = data.devices;
                    if (data.events) events = data.events;
                    if (data.todos) todos = data.todos;
                    renderAll();
                    alert('数据导入成功！');
                } catch (err) {
                    alert('导入失败，请检查文件格式。');
                }
            };
            reader.readAsText(file);
        }
        
        function resetAll() {
            if (confirm('确定要清空所有数据并恢复默认设置吗？此操作不可撤销！')) {
                localStorage.clear();
                location.reload();
            }
        }

        // ==================== 初始化 ====================
        document.getElementById('login-form').addEventListener('submit', login);
        document.getElementById('currentDate').innerText = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
