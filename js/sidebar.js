const body = document.querySelector('body'),
    sidebar = body.querySelector('.sidebar'),
    toggle = body.querySelector('.toggle'),
    searchBtn = body.querySelector('.search-box'),
    modeSwitch = body.querySelector('.toggle-switch');
    modeText = body.querySelector('.mode-text');

function enableDarkMode() {
    body.classList.toggle('dark');

    if (body.classList.contains('dark')) {
        modeText.textContent = 'Modo Claro';
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        modeText.textContent = 'Modo Oscuro';
        localStorage.setItem('dark-mode', 'disabled');
    }
}

function closeSidebar() {
    sidebar.classList.toggle('close');

    if (sidebar.classList.contains('close')) {
        localStorage.setItem('sidebar', 'closed');
    } else {
        localStorage.setItem('sidebar', 'open');
    }
}

const darkMode = localStorage.getItem('dark-mode');
if (darkMode === 'enabled') {
    enableDarkMode();
}

const sidebarState = localStorage.getItem('sidebar');
if (sidebarState === 'closed') {
    sidebar.classList.add('close');
} else if (sidebarState === 'open') {
    sidebar.classList.remove('close');
}

modeSwitch.addEventListener('click', enableDarkMode);
toggle.addEventListener('click', closeSidebar);
