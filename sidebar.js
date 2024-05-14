const body = document.querySelector('body'),
        sidebar = body.querySelector('.sidebar'),
        toggle = body.querySelector('.toggle'),
        searchBtn = body.querySelector('.search-box'),
        modeSwitch = body.querySelector('.toggle-switch');
        modeText = body.querySelector('.mode-text');

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('close');
        });

        modeSwitch.addEventListener('click', () => {
            body.classList.toggle('dark');

            if (body.classList.contains('dark')) {
                modeText.textContent = 'Modo Claro';
            } else {
                modeText.textContent = 'Modo Oscuro';
            }

        });