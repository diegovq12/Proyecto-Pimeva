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
}

const darkMode = localStorage.getItem('dark-mode');
if (darkMode === 'enabled') {
    enableDarkMode();
}

modeSwitch.addEventListener('click', enableDarkMode);
toggle.addEventListener('click', closeSidebar);



