(function () {
  'use strict';

  const STORAGE_KEY = 'car-form-session-v1';
  const { categories, cars } = window.CarData;
  const tournamentApi = window.Tournament;
  const app = document.getElementById('app');
  const liveStatus = document.getElementById('live-status');
  const dialog = document.getElementById('confirm-dialog');
  const dialogTitle = document.getElementById('confirm-title');
  const dialogCopy = document.getElementById('confirm-copy');
  const dialogConfirm = dialog.querySelector('[data-dialog-action="confirm"]');

  let session = null;
  let currentView = 'landing';
  let transitioning = false;
  let pendingAction = null;
  let selectedCarId = null;

  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const carMap = new Map(cars.map((car) => [car.id, car]));
  const categoryCars = new Map(
    categories.map((category) => [
      category.id,
      cars.filter((car) => car.categoryId === category.id),
    ])
  );

  session = loadSession();

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function loadSession() {
    try {
      const candidate = tournamentApi.deserializeState(localStorage.getItem(STORAGE_KEY));
      if (!candidate || !categoryMap.has(candidate.categoryId)) return null;
      const referencedIds = candidate.rounds.flat();
      if (!referencedIds.every((id) => carMap.has(id))) return null;
      return candidate;
    } catch {
      return null;
    }
  }

  function saveSession() {
    try {
      if (session) localStorage.setItem(STORAGE_KEY, tournamentApi.serializeState(session));
    } catch {
      // Private browsing and file:// can deny storage; the current tab still works.
    }
  }

  function categoryForSession() {
    return session ? categoryMap.get(session.categoryId) : null;
  }

  function setView(view) {
    currentView = view;
    document.body.dataset.view = view;
  }

  function announce(message) {
    liveStatus.textContent = '';
    window.setTimeout(() => {
      liveStatus.textContent = message;
    }, 20);
  }

  function renderLanding() {
    setView('landing');
    transitioning = false;
    document.title = 'CAR/FORM — 选出你眼中最美的车';

    const savedCategory = categoryForSession();
    const savedCar = session && session.complete ? carMap.get(session.championId) : null;
    let resumeMarkup = '';

    if (savedCategory) {
      if (session.complete && savedCar) {
        resumeMarkup = `
          <div class="resume-strip">
            <div class="resume-strip-copy">
              <span class="eyebrow">LAST RESULT</span>
              <strong>${escapeHtml(savedCar.brand)} ${escapeHtml(savedCar.model)}</strong>
              <small>${escapeHtml(savedCategory.name)} · 上次选出的冠军</small>
            </div>
            <button type="button" class="text-button" data-action="resume">
              看看上次的结果 <span aria-hidden="true">→</span>
            </button>
          </div>`;
      } else {
        const progress = tournamentApi.getProgress(session);
        resumeMarkup = `
          <div class="resume-strip">
            <div class="resume-strip-copy">
              <span class="eyebrow">CONTINUE</span>
              <strong>${escapeHtml(savedCategory.name)}</strong>
              <small>已完成 ${progress.completedMatches} / ${progress.totalMatches} 场选择 · ${escapeHtml(progress.roundLabel)}</small>
            </div>
            <button type="button" class="text-button" data-action="resume">
              接着上次继续 <span aria-hidden="true">→</span>
            </button>
          </div>`;
      }
    }

    const cards = categories.map((category) => `
      <button
        type="button"
        class="category-card${category.id === 'sports' ? ' category-card--wide' : ''}"
        data-category-id="${escapeHtml(category.id)}"
        aria-label="进入 ${escapeHtml(category.name)}，共 ${category.count} 款车型"
      >
        <span class="category-media">
          <img src="${escapeHtml(category.cover)}" alt="" loading="lazy" decoding="async">
          <span class="category-roman" aria-hidden="true">${escapeHtml(category.roman)}</span>
        </span>
        <span class="category-body">
          <span class="category-kicker">${escapeHtml(category.meta)}</span>
          <span class="category-card-title"><h3>${escapeHtml(category.name)}</h3></span>
          <span class="category-description">${escapeHtml(category.description)}</span>
          <span class="category-foot">
            <span>${category.count} 款车型 · ${category.choiceCount} 次选择</span>
            <span class="category-arrow" aria-hidden="true">↗</span>
          </span>
        </span>
      </button>`).join('');

    app.innerHTML = `
      <header class="site-header">
        <button type="button" class="wordmark" data-action="home" aria-label="回到首页">CAR<span>/</span>FORM</button>
        <span class="header-note">Automotive beauty index · 2026</span>
      </header>

      <main id="main" class="landing">
        <section class="hero" aria-labelledby="hero-title">
          <div class="hero-copy">
            <p class="eyebrow">A study of automotive beauty</p>
            <h1 id="hero-title">选出你眼中<br><em>最美的车</em></h1>
            <p class="hero-lede">不看参数，也不聊性能。每次两台车，只选你第一眼更喜欢的那台。十三组分开比，最后各留一个冠军。</p>
            <div class="hero-stats" role="group" aria-label="活动规模">
              <span>208 款车型</span>
              <span>13 个分类</span>
              <span>每类 16 款</span>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <img src="assets/cars/104.webp" alt="" fetchpriority="high" decoding="async">
            <div class="hero-visual-caption">
              <strong>Form follows<br>feeling.</strong>
              <span>Porsche 911<br>Sports / 01</span>
            </div>
          </div>
        </section>

        ${resumeMarkup}

        <section class="categories" aria-labelledby="category-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Select a category</p>
              <h2 id="category-title">先从哪一组开始？</h2>
            </div>
            <p>轿车和 SUV 分开排。每组 16 台车，逐轮二选一，最后留下一个冠军。</p>
          </div>
          <div class="category-grid">
            ${cards}
            <div class="category-card category-card--note" role="note" aria-label="关于本次评选">
              <span class="note-number">13</span>
              <div>
                <p class="eyebrow">Same shape, same rules</p>
                <h3>同级比，<br>才看得准。</h3>
                <p>轿车和 SUV 分开比。图片尽量选相近的年代、角度和车身颜色。这里只看设计，不评参数。</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="landing-footer">
          <span>CAR/FORM · A local-first visual study</span>
          <span>图片来自公开车型图库，仅作个人审美体验</span>
        </footer>
      </main>`;

    window.scrollTo({ top: 0, behavior: 'instant' });
    app.setAttribute('aria-busy', 'false');
  }

  function startCategory(categoryId) {
    const list = categoryCars.get(categoryId);
    if (!list || list.length !== 16) return;
    session = tournamentApi.createTournament(
      categoryId,
      list.map((car) => car.id),
      Math.random
    );
    saveSession();
    renderTournament();
  }

  function renderTournament() {
    if (!session) {
      renderLanding();
      return;
    }
    if (session.complete) {
      renderChampion();
      return;
    }

    const pair = tournamentApi.getCurrentPair(session);
    if (!pair) {
      renderChampion();
      return;
    }

    const category = categoryForSession();
    const left = carMap.get(pair[0]);
    const right = carMap.get(pair[1]);
    const progress = tournamentApi.getProgress(session);
    const percent = (progress.completedMatches / progress.totalMatches) * 100;
    setView('tournament');
    transitioning = false;
    document.title = `${category.name} · CAR/FORM`;

    app.innerHTML = `
      <div class="tournament-view">
        <header class="tournament-topbar">
          <button type="button" class="action-button" data-action="home">
            <span aria-hidden="true">←</span> 返回分类
          </button>
          <div class="round-state">
            ${escapeHtml(category.name)} · <strong>${escapeHtml(progress.roundLabel)}</strong> · 第 ${progress.matchInRound}/${progress.matchesInRound} 组
          </div>
          <button type="button" class="action-button" data-action="restart">重新开始</button>
        </header>

        <main id="main" class="tournament-main">
          <div class="progress-head">
            <span class="progress-label">${escapeHtml(progress.roundLabel)} · 选更顺眼的一台</span>
            <span class="progress-count">${progress.completedMatches} / ${progress.totalMatches}</span>
          </div>
          <div class="progress-track" role="progressbar" aria-label="投票进度" aria-valuemin="0" aria-valuemax="${progress.totalMatches}" aria-valuenow="${progress.completedMatches}">
            <span class="progress-fill" style="width:${percent}%"></span>
          </div>

          <h1 id="stage-title" class="sr-only" tabindex="-1">${escapeHtml(category.name)} ${escapeHtml(progress.roundLabel)} 二选一</h1>

          <section class="duel-grid" aria-label="二选一车型对比">
            ${choiceMarkup(left, 'A', 'left')}
            <div class="versus" aria-hidden="true">VS</div>
            ${choiceMarkup(right, 'B', 'right')}
          </section>

          <div class="tournament-actions">
            <button type="button" class="action-button" data-action="undo" ${session.history.length ? '' : 'disabled'}>
              <span class="shortcut" aria-hidden="true">⌫</span> 撤销上一步
            </button>
            <p class="hint-copy">点车型就能选 · 键盘 ← → · Backspace 撤销</p>
            <span class="tournament-footer-note">Only the eye decides</span>
          </div>
        </main>
      </div>`;

    app.setAttribute('aria-busy', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = document.getElementById('stage-title');
    if (title) window.setTimeout(() => title.focus({ preventScroll: true }), 0);
    preloadUpcoming();
  }

  function choiceMarkup(car, indexLabel, side) {
    return `
      <button
        type="button"
        class="choice-card"
        data-action="choose"
        data-car-id="${escapeHtml(car.id)}"
        data-side="${side}"
        aria-label="选择 ${escapeHtml(car.brand)} ${escapeHtml(car.model)}，${escapeHtml(car.trim)}"
      >
        <span class="choice-visual">
          <img src="${escapeHtml(car.image)}" alt="${escapeHtml(car.imageAlt)}" loading="eager" decoding="async">
          <span class="choice-index" aria-hidden="true">${indexLabel}</span>
          <span class="choice-arrow" aria-hidden="true">↗</span>
        </span>
        <span class="choice-meta">
          <span>
            <span class="choice-brand">${escapeHtml(car.brand)}</span>
            <span class="choice-model">${escapeHtml(car.model)}</span>
          </span>
          <span class="choice-trim">${escapeHtml(car.trim)}</span>
        </span>
      </button>`;
  }

  function chooseCar(carId) {
    if (transitioning || !session || session.complete) return;
    const pair = tournamentApi.getCurrentPair(session);
    if (!pair || !pair.includes(carId)) return;

    transitioning = true;
    selectedCarId = carId;
    const selected = app.querySelector(`[data-car-id="${CSS.escape(carId)}"]`);
    const cards = app.querySelectorAll('.choice-card');
    cards.forEach((card) => {
      if (card === selected) card.classList.add('is-selected');
      else card.classList.add('is-dimmed');
    });

    const car = carMap.get(carId);
    announce(`已选择 ${car.brand} ${car.model}`);
    window.setTimeout(() => {
      session = tournamentApi.vote(session, carId);
      selectedCarId = null;
      saveSession();
      if (session.complete) renderChampion();
      else renderTournament();
    }, 210);
  }

  function renderChampion() {
    if (!session || !session.complete) {
      renderLanding();
      return;
    }
    const winner = carMap.get(session.championId);
    const category = categoryForSession();
    if (!winner || !category) {
      renderLanding();
      return;
    }

    setView('champion');
    transitioning = false;
    document.title = `${winner.brand} ${winner.model} · ${category.name}冠军`;

    app.innerHTML = `
      <div class="champion-view">
        <header class="site-header">
          <button type="button" class="wordmark" data-action="home" aria-label="回到分类首页">CAR<span>/</span>FORM</button>
          <span class="header-note">${escapeHtml(category.name)} · Series champion</span>
        </header>

        <main id="main" class="champion-main">
          <div class="champion-media">
            <img src="${escapeHtml(winner.image)}" alt="${escapeHtml(winner.imageAlt)}" fetchpriority="high" decoding="async">
            <span class="champion-number" aria-hidden="true">01</span>
          </div>
          <div class="champion-copy">
            <p class="eyebrow">Series champion · ${escapeHtml(category.roman)}</p>
            <h1 id="champion-title" tabindex="-1">
              <span class="champion-brand">${escapeHtml(winner.brand)}</span>
              ${escapeHtml(winner.model)}
            </h1>
            <p class="champion-trim">${escapeHtml(winner.trim)}</p>
            <p class="champion-note">16 台车里，它留到了最后。<br>这就是你选出的 ${escapeHtml(category.name)} 冠军。</p>
            <div class="champion-actions">
              <button type="button" class="button button--solid" data-action="restart-category">这一组再选一次</button>
              <button type="button" class="button button--ghost" data-action="home">返回分类</button>
            </div>
          </div>
        </main>
      </div>`;

    app.setAttribute('aria-busy', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = document.getElementById('champion-title');
    if (title) window.setTimeout(() => title.focus({ preventScroll: true }), 0);
    announce(`${winner.brand} ${winner.model} 获得 ${category.name} 冠军`);
  }

  function preloadUpcoming() {
    const pair = tournamentApi.getCurrentPair(session);
    if (!pair) return;
    pair.forEach((id) => {
      const car = carMap.get(id);
      if (car) new Image().src = car.image;
    });

    const round = session.rounds[session.roundIndex];
    const nextStart = (session.matchIndex + 1) * 2;
    if (nextStart + 1 < round.length) {
      [round[nextStart], round[nextStart + 1]].forEach((id) => {
        const car = carMap.get(id);
        if (car) new Image().src = car.image;
      });
    }
  }

  function undoLastVote() {
    if (!session || session.history.length === 0 || transitioning) return;
    const previousRound = session.roundIndex;
    const previousMatch = session.matchIndex;
    session = tournamentApi.undo(session);
    saveSession();
    renderTournament();
    announce('已撤销上一步选择');
    if (previousRound !== session.roundIndex || previousMatch !== session.matchIndex) {
      window.setTimeout(() => {
        const title = document.getElementById('stage-title');
        if (title) title.focus({ preventScroll: true });
      }, 0);
    }
  }

  function showConfirm({ title, copy, confirmLabel, action }) {
    dialogTitle.textContent = title;
    dialogCopy.textContent = copy;
    dialogConfirm.textContent = confirmLabel;
    pendingAction = action;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else if (window.confirm(copy)) action();
  }

  function handleClick(event) {
    const categoryButton = event.target.closest('[data-category-id]');
    if (categoryButton) {
      startCategory(categoryButton.dataset.categoryId);
      return;
    }

    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;
    const action = actionTarget.dataset.action;

    if (action === 'choose') {
      chooseCar(actionTarget.dataset.carId);
    } else if (action === 'home') {
      renderLanding();
    } else if (action === 'resume') {
      if (!session) renderLanding();
      else if (session.complete) renderChampion();
      else renderTournament();
    } else if (action === 'undo') {
      undoLastVote();
    } else if (action === 'restart') {
      showConfirm({
        title: '这一组要重来吗？',
        copy: '现在的选择会清空，16 台车会重新随机排列。',
        confirmLabel: '重新开始',
        action: () => startCategory(session.categoryId),
      });
    } else if (action === 'restart-category') {
      showConfirm({
        title: '再选一轮？',
        copy: '这次的结果会清空，16 台车重新随机排列。',
        confirmLabel: '再选一次',
        action: () => startCategory(session.categoryId),
      });
    }
  }

  function handleKeydown(event) {
    if (dialog.open) return;
    if (currentView === 'tournament' && session) {
      const pair = tournamentApi.getCurrentPair(session);
      if (event.key === 'ArrowLeft' && pair) {
        event.preventDefault();
        chooseCar(pair[0]);
      } else if (event.key === 'ArrowRight' && pair) {
        event.preventDefault();
        chooseCar(pair[1]);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        undoLastVote();
      } else if (event.key === 'Escape') {
        renderLanding();
      }
    } else if (currentView === 'champion' && event.key === 'Escape') {
      renderLanding();
    }
  }

  dialog.addEventListener('click', (event) => {
    const action = event.target.closest('[data-dialog-action]');
    if (!action) {
      if (event.target === dialog) dialog.close();
      return;
    }
    if (action.dataset.dialogAction === 'confirm' && pendingAction) {
      const callback = pendingAction;
      pendingAction = null;
      dialog.close();
      callback();
    } else {
      pendingAction = null;
      dialog.close();
    }
  });

  dialog.addEventListener('cancel', () => {
    pendingAction = null;
  });

  app.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);

  renderLanding();
})();
