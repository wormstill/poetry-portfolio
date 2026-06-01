(function () {
  'use strict';

  /* ---- 梅花落瓣 ---- */
  (function initPetals() {
    var container = document.getElementById('curtain-petals');
    var colors = ['#eab8c8', '#f0c0d0', '#e8a8b8', '#f2c8d4', '#ecb4c4', '#f4ccd8', '#eebcc8'];
    var count = 22;
    for (var i = 0; i < count; i++) {
      var petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.setProperty('--petal-color', colors[Math.floor(Math.random() * colors.length)]);
      petal.style.width = (8 + Math.random() * 10) + 'px';
      petal.style.height = (10 + Math.random() * 10) + 'px';
      petal.style.animationDuration = (10 + Math.random() * 16) + 's';
      petal.style.animationDelay = Math.random() * 14 + 's';
      petal.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      petal.style.setProperty('--spin', (200 + Math.random() * 400) + 'deg');
      container.appendChild(petal);
    }
  })();

  /* ---- 幕布揭晓 ---- */
  var curtain = document.getElementById('curtain');
  document.documentElement.style.overflow = 'hidden';

  curtain.addEventListener('click', function () {
    document.documentElement.style.overflow = '';
    this.classList.add('open');
    this.addEventListener('transitionend', function () {
      this.style.display = 'none';
    }, { once: true });
  });

  /* ---- 枫叶飘落特效 ---- */
  (function initLeaves() {
    var leavesContainer = document.createElement('div');
    leavesContainer.id = 'leaves-container';
    document.body.appendChild(leavesContainer);

    var leaves = ['🍁', '🍂', '🍁', '🍃', '🍂'];
    var sizes = ['sm', 'md', 'md', 'lg', 'sm', 'md', 'md'];
    var count = 20;

    for (var i = 0; i < count; i++) {
      var leaf = document.createElement('span');
      leaf.className = 'leaf ' + sizes[i % sizes.length];
      leaf.textContent = leaves[i % leaves.length];
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = (Math.random() * 8 + 10) + 's';
      leaf.style.animationDelay = (Math.random() * 15) + 's';
      leavesContainer.appendChild(leaf);
    }
  })();

  const container = document.getElementById('poems-container');
  const filterNav = document.querySelector('.filter-nav');

  let allPoems = [];
  let activeCategory = 'all';

  /* ---- 加载数据 ---- */
  fetch('poems.json?v=2')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (poems) {
      allPoems = poems;
      buildFilters();
      render();
    })
    .catch(function (err) {
      container.innerHTML =
        '<p class="error-text">无法加载作品，请稍后再试。<br><small>' +
        err.message +
        '</small></p>';
    });

  /* ---- 生成筛选按钮 ---- */
  function buildFilters() {
    var categories = ['all'];
    var seen = { all: true };

    allPoems.forEach(function (p) {
      var cat = p.category || 'other';
      if (!seen[cat]) {
        seen[cat] = true;
        categories.push(cat);
      }
    });

    if (categories.length <= 2) return;

    var labelMap = {
      all: '全部',
      poetry: '诗歌',
      prose: '散文',
    };

    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'all' ? ' active' : '');
      btn.setAttribute('data-category', cat);
      btn.textContent = labelMap[cat] || cat;
      btn.addEventListener('click', function () {
        activeCategory = cat;
        var buttons = filterNav.querySelectorAll('.filter-btn');
        buttons.forEach(function (b) { return b.classList.remove('active'); });
        btn.classList.add('active');
        render();
      });
      filterNav.appendChild(btn);
    });
  }

  /* ---- 渲染卡片 ---- */
  function render() {
    var filtered =
      activeCategory === 'all'
        ? allPoems
        : allPoems.filter(function (p) { return p.category === activeCategory; });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-text">这个分类下暂无作品。</p>';
      return;
    }

    var frag = document.createDocumentFragment();

    filtered.forEach(function (poem) {
      var card = document.createElement('article');
      card.className = 'poem-card';
      card.setAttribute('data-category', poem.category);

      /* 卡片头部 */
      var header = document.createElement('div');
      header.className = 'card-header';

      var title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = poem.title;

      var author = document.createElement('span');
      author.className = 'card-author';
      author.textContent = '— ' + poem.author;

      header.appendChild(title);
      header.appendChild(author);

      /* 正文 */
      var body = document.createElement('div');
      body.className = 'card-body';

      poem.lines.forEach(function (line, i) {
        if (line === '') {
          var br = document.createElement('span');
          br.className = 'stanza-break';
          br.setAttribute('aria-hidden', 'true');
          body.appendChild(br);
        } else {
          var p = document.createElement('p');
          p.textContent = line;
          body.appendChild(p);
        }
      });

      /* 元信息 */
      var meta = document.createElement('div');
      meta.className = 'card-meta';
      var parts = [];
      if (poem.date) parts.push(poem.date);
      if (poem.form) parts.push(poem.form);
      meta.textContent = parts.join(' · ');

      /* 夜空星辰视觉图 */
      var visual = document.createElement('div');
      visual.className = 'poem-visual';

      var starCount = 45 + Math.floor(Math.random() * 50);
      for (var s = 0; s < starCount; s++) {
        var star = document.createElement('span');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        var starSize = 1 + Math.random() * 2.8;
        star.style.width = starSize + 'px';
        star.style.height = starSize + 'px';
        star.style.setProperty('--star-opacity', (0.25 + Math.random() * 0.7));
        star.style.setProperty('--twinkle-dur', (2 + Math.random() * 4) + 's');
        star.style.setProperty('--twinkle-delay', Math.random() * 3 + 's');
        star.style.setProperty('--glow-size', (starSize * 1.5) + 'px');
        visual.appendChild(star);
      }

      card.appendChild(header);
      card.appendChild(body);
      card.appendChild(meta);
      card.appendChild(visual);
      frag.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(frag);
  }
})();
