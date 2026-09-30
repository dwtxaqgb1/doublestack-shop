export function initSidebar(currentPage) {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const navItems = document.querySelectorAll('.sidebar-nav li');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        const icon = sidebarToggle.querySelector('i');
        if (sidebar.classList.contains('collapsed')) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        } else {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
    });
    
    logoutBtn.addEventListener('click', async function() {
        if (confirm('确定要退出登录吗？')) {
            try {
                await fetch('/api/logout', { method: 'POST' });
            } catch (error) {
                // 即使请求失败也清除界面状态，避免用户误以为仍处于登录状态。
            }
            localStorage.removeItem('username');
            localStorage.removeItem('is_admin');
            localStorage.removeItem('remember');
            window.location.href = '../login/login.html';
        }
    });
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });

    loadSidebarVersion();
}

async function loadSidebarVersion() {
    const versionElement = document.getElementById('sidebarVersion');
    if (!versionElement) return;

    try {
        const response = await fetch('/api/system/version');
        if (!response.ok) return;
        const result = await response.json();
        if (result.current_version) versionElement.textContent = result.current_version;
    } catch {
        // 保留 HTML 中的默认版本，侧边栏不能因版本请求失败而影响使用。
    }
}

// ===== Mobile hamburger menu =====
(function() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(btn);
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    function toggle(open) {
        sidebar.classList.toggle('mobile-open', open);
        overlay.classList.toggle('show', open);
    }
    btn.addEventListener('click', () => toggle(!sidebar.classList.contains('mobile-open')));
    overlay.addEventListener('click', () => toggle(false));
    sidebar.querySelectorAll('.sidebar-nav a').forEach(a => a.addEventListener('click', () => toggle(false)));
})();
