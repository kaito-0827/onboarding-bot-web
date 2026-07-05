(() => {
    'use strict';

    const MAX_PARAMS_SHOWN = 5;

    const searchInput = document.getElementById('cmd-search-input');
    const tabsEl = document.getElementById('cmd-tabs');
    const countEl = document.getElementById('cmd-count');
    const listEl = document.getElementById('cmd-list');
    const descEl = document.getElementById('page-desc');

    let allCommands = [];
    let activeCategory = 'すべて';

    function createCommandCard(cmd) {
        const card = document.createElement('div');
        card.className = 'cmd-card';

        const row = document.createElement('div');
        row.className = 'row';

        const nameEl = document.createElement('code');
        nameEl.className = 'name';
        nameEl.textContent = cmd.name;
        row.appendChild(nameEl);

        if (cmd.admin) {
            const adminBadge = document.createElement('span');
            adminBadge.className = 'badge admin';
            adminBadge.textContent = '🔒 管理者';
            row.appendChild(adminBadge);
        }

        const catBadge = document.createElement('span');
        catBadge.className = 'badge cat';
        catBadge.textContent = cmd.category;
        row.appendChild(catBadge);

        if (cmd.type === 'context_menu') {
            const typeBadge = document.createElement('span');
            typeBadge.className = 'badge cat';
            typeBadge.textContent = '右クリックメニュー';
            row.appendChild(typeBadge);
        }

        card.appendChild(row);

        const desc = document.createElement('div');
        desc.className = 'desc';
        desc.textContent = cmd.description;
        card.appendChild(desc);

        if (Array.isArray(cmd.params) && cmd.params.length > 0) {
            const params = document.createElement('div');
            params.className = 'params';
            params.appendChild(document.createTextNode('引数: '));

            const shown = cmd.params.slice(0, MAX_PARAMS_SHOWN);
            shown.forEach((p, i) => {
                const code = document.createElement('code');
                code.textContent = p.name;
                params.appendChild(code);
                if (i < shown.length - 1) {
                    params.appendChild(document.createTextNode(' '));
                }
            });

            const remaining = cmd.params.length - shown.length;
            if (remaining > 0) {
                params.appendChild(document.createTextNode(' +' + remaining));
            }

            card.appendChild(params);
        }

        return card;
    }

    function renderTabs(categories) {
        tabsEl.innerHTML = '';

        const allTab = document.createElement('button');
        allTab.type = 'button';
        allTab.className = 'cmd-tab active';
        allTab.dataset.category = 'すべて';
        allTab.textContent = 'すべて';
        allTab.addEventListener('click', () => setActiveCategory('すべて'));
        tabsEl.appendChild(allTab);

        categories.forEach((cat) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'cmd-tab';
            tab.dataset.category = cat;
            tab.textContent = cat;
            tab.addEventListener('click', () => setActiveCategory(cat));
            tabsEl.appendChild(tab);
        });
    }

    function setActiveCategory(category) {
        activeCategory = category;
        tabsEl.querySelectorAll('.cmd-tab').forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        render();
    }

    function getFilteredCommands() {
        const query = searchInput.value.trim().toLowerCase();

        return allCommands.filter((cmd) => {
            const matchesCategory = activeCategory === 'すべて' || cmd.category === activeCategory;
            if (!matchesCategory) return false;

            if (!query) return true;

            const name = (cmd.name || '').toLowerCase();
            const description = (cmd.description || '').toLowerCase();
            return name.includes(query) || description.includes(query);
        });
    }

    function render() {
        const filtered = getFilteredCommands();

        countEl.textContent = filtered.length + '件を表示中';

        listEl.innerHTML = '';

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cmd-empty';
            empty.textContent = '🔍 一致するコマンドが見つかりませんでした';
            listEl.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        filtered.forEach((cmd) => fragment.appendChild(createCommandCard(cmd)));
        listEl.appendChild(fragment);
    }

    function showLoadError() {
        listEl.innerHTML = '';
        const empty = document.createElement('div');
        empty.className = 'cmd-empty';
        empty.textContent = '読み込みに失敗しました';
        listEl.appendChild(empty);
        countEl.textContent = '';
    }

    fetch('./assets/commands.json')
        .then((res) => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then((data) => {
            allCommands = Array.isArray(data.commands) ? data.commands : [];
            const categories = Array.isArray(data.categories) ? data.categories : [];

            if (descEl) {
                descEl.textContent = '全' + allCommands.length + 'のスラッシュコマンドをカテゴリ別・検索で確認できます';
            }

            renderTabs(categories);
            render();
        })
        .catch(() => {
            showLoadError();
        });

    searchInput.addEventListener('input', render);
})();
