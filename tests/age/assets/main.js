/* 你的心理年龄 —— 主逻辑
 * 容器约束：无联网、无内联脚本、无动态执行代码、无后台线程，事件全部用 addEventListener 绑定。
 * 端能力：window.xhs.miniTool（writeTempFile / saveImageToPhotosAlbum / postNote），调用前一律判空并降级。
 */

(function () {
  'use strict';

  var TOTAL = XHS_QUESTIONS.length;
  var DIMS = XHS_DIMS;
  var STORE_KEY = 'xhs_mental_age_v1';
  var NEXT_DELAY = 250;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif';

  var state = {
    index: 0,
    answers: [],
    order: [],
    locked: false,
    realAge: 24
  };

  var el = {};
  var current = null;

  /* ---------------- 工具 ---------------- */

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function seededShuffle(arr, seed) {
    var a = arr.slice();
    var s = seed;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      var j = Math.floor((s / 233280) * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function buildOrder() {
    state.order = XHS_QUESTIONS.map(function (q) {
      return seededShuffle([0, 1, 2, 3], q.id * 4211 + 17);
    });
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    window.setTimeout(function () {
      el.toast.classList.remove('show');
    }, 2000);
  }

  function showScreen(id) {
    ['screen-intro', 'screen-quiz', 'screen-age', 'screen-result'].forEach(function (sid) {
      var node = document.getElementById(sid);
      if (node) node.classList.toggle('active', sid === id);
    });
    window.scrollTo(0, 0);
  }

  // 网页版才出现的返回入口（小工具容器里不注入）
  function injectWebNav() {
    if (typeof window !== 'undefined' && window.xhs && window.xhs.miniTool) return;
    var bar = document.createElement('div');
    bar.className = 'web-nav';
    var a = document.createElement('a');
    a.setAttribute('href', '../');
    a.textContent = '← 返回测试中心';
    bar.appendChild(a);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  /* ---------------- 答题 ---------------- */

  function startQuiz() {
    state.index = 0;
    state.answers = [];
    state.locked = false;
    buildOrder();
    showScreen('screen-quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = XHS_QUESTIONS[state.index];
    var order = state.order[state.index];

    el.qIndex.textContent = '第 ' + (state.index + 1) + ' 题 / 共 ' + TOTAL + ' 题';
    el.qText.textContent = q.q;
    el.progressFill.style.width = ((state.index / TOTAL) * 100).toFixed(1) + '%';
    el.progressCount.textContent = (state.index + 1) + ' / ' + TOTAL;
    el.btnPrev.disabled = state.index === 0;

    clear(el.optWrap);
    order.forEach(function (origIdx, pos) {
      var opt = q.opts[origIdx];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      btn.style.animationDelay = (pos * 0.05).toFixed(2) + 's';

      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = LETTERS[pos];
      var text = document.createElement('span');
      text.className = 'opt-text';
      text.textContent = opt.t;

      btn.appendChild(badge);
      btn.appendChild(text);
      if (state.answers[state.index] === origIdx) btn.classList.add('picked');
      btn.addEventListener('click', function () {
        pick(origIdx, btn);
      });
      el.optWrap.appendChild(btn);
    });

    state.locked = false;
  }

  function pick(origIdx, btn) {
    if (state.locked) return;
    state.locked = true;

    state.answers[state.index] = origIdx;
    Array.prototype.forEach.call(el.optWrap.children, function (node) {
      node.disabled = true;
    });
    btn.classList.add('picked');

    window.setTimeout(function () {
      if (state.index >= TOTAL - 1) {
        showScreen('screen-age');
        el.ageInput.focus();
      } else {
        state.index += 1;
        renderQuestion();
      }
    }, NEXT_DELAY);
  }

  function goPrev() {
    if (state.index === 0) return;
    state.index -= 1;
    renderQuestion();
  }

  /* ---------------- 计分 ---------------- */

  function computeMetrics() {
    var sums = {};
    var counts = {};
    DIMS.forEach(function (d) {
      sums[d.key] = 0;
      counts[d.key] = 0;
    });

    XHS_QUESTIONS.forEach(function (q, i) {
      var pickedIdx = state.answers[i];
      if (pickedIdx === undefined) pickedIdx = 0;
      sums[q.dim] += q.opts[pickedIdx].lv;
      counts[q.dim] += 1;
    });

    var scores = {};
    var totalLv = 0;
    DIMS.forEach(function (d) {
      scores[d.key] = counts[d.key] ? Math.round((sums[d.key] / (counts[d.key] * 3)) * 100) : 0;
      totalLv += sums[d.key];
    });

    var maturity = Math.round((totalLv / (TOTAL * 3)) * 100);
    var mentalAge = clamp(Math.round(13 + maturity * 0.27), 13, 40);

    return {
      scores: scores,
      maturity: maturity,
      mentalAge: mentalAge,
      diff: mentalAge - state.realAge
    };
  }

  function pickTitle(diff) {
    for (var i = 0; i < XHS_AGE_TITLES.length; i++) {
      if (diff >= XHS_AGE_TITLES[i].min) return XHS_AGE_TITLES[i];
    }
    return XHS_AGE_TITLES[XHS_AGE_TITLES.length - 1];
  }

  function diffText(diff) {
    if (diff > 0) return '比实际年龄大 ' + diff + ' 岁';
    if (diff < 0) return '比实际年龄小 ' + Math.abs(diff) + ' 岁';
    return '和实际年龄正好一样';
  }

  /* ---------------- 结果渲染 ---------------- */

  function renderMetrics(m) {
    clear(el.metricsWrap);
    DIMS.forEach(function (d) {
      var value = m.scores[d.key];

      var box = document.createElement('div');
      box.className = 'metric';

      var head = document.createElement('div');
      head.className = 'metric-head';
      var label = document.createElement('span');
      label.textContent = d.name;
      var chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = value >= 50 ? '偏沉稳' : '偏直接';
      head.appendChild(label);
      head.appendChild(chip);

      var track = document.createElement('div');
      track.className = 'metric-track';
      var fill = document.createElement('div');
      fill.className = 'metric-fill';
      fill.style.width = value + '%';
      track.appendChild(fill);

      var hint = document.createElement('div');
      hint.className = 'metric-hint';
      hint.textContent = value >= 50 ? d.highLine : d.lowLine;

      box.appendChild(head);
      box.appendChild(track);
      box.appendChild(hint);
      el.metricsWrap.appendChild(box);
    });
  }

  function renderResult(m) {
    var title = pickTitle(m.diff);
    current = { metrics: m, title: title };

    el.resLevel.textContent = title.name;
    el.resAge.textContent = m.mentalAge;
    el.resDiff.textContent = diffText(m.diff) + '（你填的是 ' + state.realAge + ' 岁）';
    el.resTag.textContent = title.line;
    el.resPortrait.textContent = title.why;
    el.resScene.textContent = title.scene;
    el.resStrength.textContent = title.strength;
    el.resFit.textContent = title.fit;

    renderMetrics(m);
    el.facts.textContent = '本次实测：' + TOTAL + ' 题，沉稳值 ' + m.maturity + ' / 100。';

    clear(el.adviceList);
    title.advice.forEach(function (line) {
      var li = document.createElement('li');
      li.textContent = line;
      el.adviceList.appendChild(li);
    });

    drawCard();
    saveLast();
    showScreen('screen-result');
  }

  function submitAge() {
    var v = parseInt(el.ageInput.value, 10);
    if (!v || v < 12 || v > 80) {
      el.ageError.textContent = '请填 12–80 之间的岁数';
      return;
    }
    el.ageError.textContent = '';
    state.realAge = v;
    renderResult(computeMetrics());
  }

  function saveLast() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({
        answers: state.answers,
        realAge: state.realAge,
        at: Date.now()
      }));
    } catch (e) {
      /* 存储不可用时静默跳过 */
    }
  }

  function renderLast() {
    var raw = null;
    try {
      raw = window.localStorage.getItem(STORE_KEY);
    } catch (e) {
      raw = null;
    }
    if (!raw) {
      el.btnLast.style.display = 'none';
      return;
    }
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      el.btnLast.style.display = 'none';
      return;
    }
    if (!data.answers || data.answers.length !== TOTAL) {
      el.btnLast.style.display = 'none';
      return;
    }
    el.btnLast.style.display = 'block';
    el.btnLast.textContent = '查看上次结果';
    el.btnLast.addEventListener('click', function () {
      state.answers = data.answers;
      state.realAge = data.realAge || 24;
      renderResult(computeMetrics());
    });
  }

  /* ---------------- 结果卡 ---------------- */

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var line = '';
    var lines = [];
    var tailMarks = '。，、；：？！）」』%';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var test = line + ch;
      var keepTail = tailMarks.indexOf(ch) >= 0;
      if (ctx.measureText(test).width > maxWidth && line !== '' && !keepTail) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    lines.forEach(function (l, idx) {
      ctx.fillText(l, x, y + idx * lineHeight);
    });
    return { end: y + lines.length * lineHeight, count: lines.length };
  }

  function drawCard() {
    var canvas = el.cardCanvas;
    var ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;

    var m = current.metrics;
    var t = current.title;

    ctx.fillStyle = '#fdfaf6';
    ctx.fillRect(0, 0, 1080, 1920);

    var grad = ctx.createLinearGradient(0, 40, 1080, 660);
    grad.addColorStop(0, '#f7b96b');
    grad.addColorStop(1, '#c2631f');
    ctx.fillStyle = grad;
    roundRect(ctx, 50, 40, 980, 620, 46);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '30px ' + FONT;
    ctx.fillText('你的心理年龄', 100, 130);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, 100, 160, 230, 54, 27);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px ' + FONT;
    ctx.fillText(t.name, 128, 197);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 150px ' + FONT;
    ctx.fillText(String(m.mentalAge), 96, 400);
    ctx.font = '46px ' + FONT;
    var ageW = ctx.measureText(String(m.mentalAge)).width;
    ctx.font = '44px ' + FONT;
    ctx.fillText('岁', 96 + 150 * String(m.mentalAge).length * 0.58 + 20, 400);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = '38px ' + FONT;
    ctx.fillText(diffText(m.diff), 100, 470);

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '34px ' + FONT;
    wrapText(ctx, t.line, 100, 545, 880, 50);

    var y = 740;
    DIMS.forEach(function (d) {
      var value = m.scores[d.key];
      ctx.fillStyle = '#6b5b4a';
      ctx.font = '30px ' + FONT;
      ctx.fillText(d.name, 90, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#c2631f';
      ctx.font = 'bold 30px ' + FONT;
      ctx.fillText(value >= 50 ? '偏沉稳' : '偏直接', 990, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#f1e7da';
      roundRect(ctx, 90, y + 22, 900, 16, 8);
      ctx.fill();
      var barGrad = ctx.createLinearGradient(90, 0, 990, 0);
      barGrad.addColorStop(0, '#f7c27a');
      barGrad.addColorStop(1, '#c2631f');
      ctx.fillStyle = barGrad;
      roundRect(ctx, 90, y + 22, Math.max(16, 900 * clamp(value, 0, 100) / 100), 16, 8);
      ctx.fill();
      y += 96;
    });

    var boxTop = y + 30;
    ctx.fillStyle = '#fdf1e4';
    roundRect(ctx, 50, boxTop, 980, 300, 36);
    ctx.fill();

    ctx.fillStyle = '#b9682a';
    ctx.font = 'bold 32px ' + FONT;
    ctx.fillText('接下来可以这样做', 100, boxTop + 66);

    ctx.fillStyle = '#8a6242';
    ctx.font = '30px ' + FONT;
    var cursor = boxTop + 126;
    t.advice.slice(0, 2).forEach(function (line) {
      cursor = wrapText(ctx, '· ' + line, 100, cursor, 820, 46).end + 6;
    });

    ctx.fillStyle = '#c9b6a3';
    ctx.font = '24px ' + FONT;
    wrapText(ctx, XHS_DISCLAIMER, 90, Math.max(Math.min(cursor + 60, 1836), 1790), 900, 36);
  }

  /* ---------------- 端能力 ---------------- */

  function miniToolApi() {
    if (typeof window !== 'undefined' && window.xhs && window.xhs.miniTool) {
      return window.xhs.miniTool;
    }
    return null;
  }

  function toTempFile(dataUrl) {
    var api = miniToolApi();
    if (!api || !api.writeTempFile) return Promise.reject(new Error('unsupported'));
    return api.writeTempFile({ data: dataUrl }).then(function (res) {
      if (!res || !res.filePath) throw new Error('no-path');
      return res.filePath;
    });
  }

  function saveCard() {
    var api = miniToolApi();
    var dataUrl = el.cardCanvas.toDataURL('image/png');
    if (!api || !api.saveImageToPhotosAlbum) {
      try {
        var link = document.createElement('a');
        link.setAttribute('href', dataUrl);
        link.setAttribute('download', '心理年龄.png');
        document.body.appendChild(link);
        link.click();
        window.setTimeout(function () {
          if (link.parentNode) link.parentNode.removeChild(link);
        }, 0);
        toast('图片已开始下载');
      } catch (e) {
        toast('这个环境不能自动保存，长按上面的图片也能存');
      }
      return;
    }
    toTempFile(dataUrl)
      .then(function (filePath) {
        return api.saveImageToPhotosAlbum({ filePath: filePath });
      })
      .catch(function () {
        return api.saveImageToPhotosAlbum({ filePath: dataUrl });
      })
      .then(function () {
        toast('已保存到相册');
      })
      .catch(function () {
        toast('保存没成功，可以长按图片手动保存');
      });
  }

  function shareNote() {
    var api = miniToolApi();
    var m = current.metrics;
    var t = current.title;
    var content = '我的心理年龄是 ' + m.mentalAge + ' 岁（' + diffText(m.diff) + '）\n\n' +
      t.line + '\n\n' + XHS_DISCLAIMER;

    if (!api || !api.postNote) {
      if (el.sharePanel) {
        el.shareText.value = content;
        el.sharePanel.style.display = 'block';
        window.setTimeout(function () {
          el.shareText.focus();
          el.shareText.select();
          el.shareText.scrollTop = 0;
        }, 60);
        el.sharePanel.scrollIntoView({ block: 'center' });
        toast('文案已备好，复制后去小红书发笔记');
      }
      return;
    }
    toTempFile(el.cardCanvas.toDataURL('image/png'))
      .then(function (filePath) {
        return api.postNote({
          title: '我的心理年龄',
          content: content.slice(0, 1000),
          tags: '#心理年龄 #测试 #自我成长',
          mediaInfo: { image_resources: [{ url: filePath }] }
        });
      })
      .catch(function () {
        toast('发笔记没成功，可以先保存图片再手动发布');
      });
  }

  /* ---------------- 初始化 ---------------- */

  function cacheEls() {
    el = {
      toast: document.getElementById('toast'),
      progressCount: document.getElementById('progress-count'),
      progressFill: document.getElementById('progress-fill'),
      qIndex: document.getElementById('q-index'),
      qText: document.getElementById('q-text'),
      optWrap: document.getElementById('opt-wrap'),
      btnPrev: document.getElementById('btn-prev'),
      btnStart: document.getElementById('btn-start'),
      btnRestart: document.getElementById('btn-restart'),
      btnLast: document.getElementById('btn-last'),
      btnSave: document.getElementById('btn-save'),
      btnShare: document.getElementById('btn-share'),
      ageInput: document.getElementById('age-input'),
      ageError: document.getElementById('age-error'),
      btnAgeSubmit: document.getElementById('btn-age-submit'),
      resLevel: document.getElementById('res-level'),
      resAge: document.getElementById('res-age'),
      resDiff: document.getElementById('res-diff'),
      resTag: document.getElementById('res-tag'),
      resPortrait: document.getElementById('res-portrait'),
      resScene: document.getElementById('res-scene'),
      resStrength: document.getElementById('res-strength'),
      resFit: document.getElementById('res-fit'),
      metricsWrap: document.getElementById('metrics-wrap'),
      facts: document.getElementById('facts'),
      adviceList: document.getElementById('advice-list'),
      cardCanvas: document.getElementById('card-canvas'),
      sharePanel: document.getElementById('share-panel'),
      shareText: document.getElementById('share-text'),
      btnShareClose: document.getElementById('btn-share-close'),
      btnShareReselect: document.getElementById('btn-share-reselect'),
      disclaimer: document.getElementById('disclaimer')
    };
  }

  function init() {
    cacheEls();
    injectWebNav();
    el.disclaimer.textContent = XHS_DISCLAIMER;

    el.btnStart.addEventListener('click', startQuiz);
    el.btnRestart.addEventListener('click', startQuiz);
    el.btnPrev.addEventListener('click', goPrev);
    el.btnSave.addEventListener('click', saveCard);
    el.btnShare.addEventListener('click', shareNote);
    el.btnAgeSubmit.addEventListener('click', submitAge);
    el.ageInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') submitAge();
    });
    el.ageInput.addEventListener('input', function () {
      el.ageError.textContent = '';
    });
    if (el.btnShareClose) {
      el.btnShareClose.addEventListener('click', function () {
        el.sharePanel.style.display = 'none';
      });
    }
    if (el.btnShareReselect) {
      el.btnShareReselect.addEventListener('click', function () {
        el.shareText.focus();
        el.shareText.select();
        el.shareText.scrollTop = 0;
        toast('已选中，直接复制就行');
      });
    }

    renderLast();
    showScreen('screen-intro');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
