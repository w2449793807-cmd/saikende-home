/* 校招测评作答画像 —— 主逻辑
 * 容器约束：无联网、无内联脚本、无动态执行代码、无后台线程，事件全部用 addEventListener 绑定。
 * 端能力：window.xhs.miniTool（writeTempFile / saveImageToPhotosAlbum / postNote），调用前一律判空并降级。
 */

(function () {
  'use strict';

  var TOTAL = XHS_QUESTIONS.length;
  var PAIR_KEYS = ['P1', 'P2', 'P3', 'P4'];
  var STORE_KEY = 'xhs_campus_profile_v2';
  var NEXT_DELAY = 240;
  var LETTERS = ['A', 'B', 'C', 'D'];

  var state = {
    index: 0,
    answers: [],
    order: [],
    times: [],
    changes: 0,
    shownAt: 0,
    locked: false
  };

  var current = null;
  var el = {};

  /* ---------------- 基础工具 ---------------- */

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
      return seededShuffle([0, 1, 2, 3], q.id * 7919 + 13);
    });
  }

  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    window.setTimeout(function () {
      el.toast.classList.remove('show');
    }, 2000);
  }

  function showScreen(id) {
    ['screen-intro', 'screen-quiz', 'screen-result'].forEach(function (sid) {
      var node = document.getElementById(sid);
      if (node) node.classList.toggle('active', sid === id);
    });
    window.scrollTo(0, 0);
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* ---------------- 答题流程 ---------------- */

  function startQuiz() {
    state.index = 0;
    state.answers = [];
    state.times = [];
    state.changes = 0;
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

    state.shownAt = Date.now();
    state.locked = false;
  }

  function pick(origIdx, btn) {
    if (state.locked) return;
    state.locked = true;

    if (state.answers[state.index] !== undefined) {
      state.changes += 1;
    } else {
      state.times[state.index] = clamp(Date.now() - state.shownAt, 350, 120000);
    }
    state.answers[state.index] = origIdx;

    Array.prototype.forEach.call(el.optWrap.children, function (node) {
      node.disabled = true;
    });
    btn.classList.add('picked');

    window.setTimeout(function () {
      if (state.index >= TOTAL - 1) {
        finish();
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
    var byPair = {};
    var sumS = 0;
    var sumExt = 0;

    XHS_QUESTIONS.forEach(function (q, i) {
      var pickedIdx = state.answers[i];
      if (pickedIdx === undefined) pickedIdx = 0;
      var opt = q.opts[pickedIdx];
      sumS += opt.s;
      sumExt += opt.ext;
      if (q.pair) {
        if (!byPair[q.pair]) byPair[q.pair] = [];
        byPair[q.pair].push(opt.tend);
      }
    });

    var passed = 0;
    PAIR_KEYS.forEach(function (k) {
      var pair = byPair[k];
      if (!pair || pair.length < 2) return;
      var a = pair[0];
      var b = pair[1];
      if ((a === 0 && b === 0) || (a > 0 && b > 0) || (a < 0 && b < 0)) passed += 1;
    });

    var validTimes = state.times.filter(function (t) {
      return typeof t === 'number' && t > 0;
    });
    var avgSec = validTimes.length
      ? validTimes.reduce(function (x, y) { return x + y; }, 0) / validTimes.length / 1000
      : 10;

    var ratio = sumS / (TOTAL * 2);

    return {
      passed: passed,
      consistency: Math.round((passed / PAIR_KEYS.length) * 100),
      real: clamp(Math.round(78 - (ratio - 0.3125) * 150), 0, 100),
      stability: Math.round(100 - (sumExt / (TOTAL * 2)) * 100),
      pace: Math.round(avgSec * 10) / 10,
      avgSec: Math.round(avgSec * 10) / 10,
      changes: state.changes
    };
  }

  function resultKey(m) {
    return (m.consistency >= 75 ? 'T' : 'F') +
      (m.real >= 60 ? 'T' : 'F') +
      (m.stability >= 55 ? 'T' : 'F');
  }

  /* ---------------- 结果渲染 ---------------- */

  function renderMetrics(m) {
    clear(el.metricsWrap);
    XHS_METRICS.forEach(function (def) {
      var value = m[def.key];
      var isInfo = def.info === true;
      var isGood = !isInfo && value >= def.good;

      var box = document.createElement('div');
      box.className = 'metric';

      var head = document.createElement('div');
      head.className = 'metric-head';

      var label = document.createElement('span');
      label.textContent = def.label;

      var right = document.createElement('span');
      if (isInfo) {
        right.className = 'chip';
        right.textContent = value + def.suffix;
      } else {
        right.className = 'chip ' + (isGood ? 'good' : 'bad');
        right.textContent = isGood ? def.goodText : def.badText;
      }

      head.appendChild(label);
      head.appendChild(right);

      var hint = document.createElement('div');
      hint.className = 'metric-hint';
      hint.textContent = isInfo ? def.hint : def.hint + '（本次 ' + value + def.suffix + '）';

      box.appendChild(head);

      if (!isInfo) {
        var track = document.createElement('div');
        track.className = 'metric-track';
        var fill = document.createElement('div');
        fill.className = 'metric-fill' + (isGood ? '' : ' warn');
        fill.style.width = value + '%';
        track.appendChild(fill);
        box.appendChild(track);
      }

      box.appendChild(hint);
      el.metricsWrap.appendChild(box);
    });
  }

  function renderResult(key, m) {
    var res = XHS_RESULTS[key];
    current = { key: key, metrics: m, result: res };

    el.resLevel.textContent = res.level;
    el.resName.textContent = res.name;
    el.resTag.textContent = res.oneLine;
    el.resPortrait.textContent = res.why;
    el.resScene.textContent = res.scene;
    el.resStrength.textContent = res.strength;
    el.resFit.textContent = res.fit;

    renderMetrics(m);

    el.facts.textContent = '本次实测：' + TOTAL + ' 题，平均每题 ' + m.avgSec +
      ' 秒；一致性检查过了 ' + m.passed + '/' + PAIR_KEYS.length + ' 组。';

    clear(el.adviceList);
    res.advice.forEach(function (line) {
      var li = document.createElement('li');
      li.textContent = line;
      el.adviceList.appendChild(li);
    });

    drawCard();
    saveLast();
    showScreen('screen-result');
  }

  function finish() {
    var m = computeMetrics();
    renderResult(resultKey(m), m);
  }

  function saveLast() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({
        key: current.key,
        metrics: current.metrics,
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
    if (!XHS_RESULTS[data.key]) {
      el.btnLast.style.display = 'none';
      return;
    }
    el.btnLast.textContent = '查看上次结果：' + XHS_RESULTS[data.key].name;
    el.btnLast.style.display = 'block';
    el.btnLast.addEventListener('click', function () {
      renderResult(data.key, data.metrics);
    });
  }

  /* ---------------- 结果卡（Canvas 1080x1920） ---------------- */

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

  var FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif';

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var line = '';
    var lines = [];
    for (var i = 0; i < text.length; i++) {
      var test = line + text.charAt(i);
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        lines.push(line);
        line = text.charAt(i);
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
    var W = 1080;
    var H = 1920;
    canvas.width = W;
    canvas.height = H;

    var m = current.metrics;
    var res = current.result;

    ctx.fillStyle = '#fbf9f6';
    ctx.fillRect(0, 0, W, H);

    /* 顶部主卡 */
    var heroGrad = ctx.createLinearGradient(0, 60, W, 620);
    heroGrad.addColorStop(0, '#35779c');
    heroGrad.addColorStop(1, '#245673');
    ctx.fillStyle = heroGrad;
    roundRect(ctx, 50, 50, W - 100, 580, 40);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = '30px ' + FONT;
    ctx.fillText('你的作答画像', 100, 140);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    roundRect(ctx, 100, 170, 190, 52, 26);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px ' + FONT;
    ctx.fillText(res.level, 128, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px ' + FONT;
    ctx.fillText(res.name, 100, 330);

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = '36px ' + FONT;
    var tag = wrapText(ctx, res.oneLine, 100, 415, 880, 54);

    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = '26px ' + FONT;
    ctx.fillText('16 题原创情景自测 · 与任何企业的官方测评无关', 100, Math.min(Math.max(tag.end + 25, 545), 600));

    /* 四项数据 */
    var y = 700;
    XHS_METRICS.filter(function (d) { return d.info !== true; }).forEach(function (def) {
      var value = m[def.key];
      var isGood = value >= def.good;

      ctx.fillStyle = '#5d6672';
      ctx.font = '30px ' + FONT;
      ctx.fillText(def.label, 90, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = isGood ? '#3f8f6b' : '#c4763a';
      ctx.font = 'bold 30px ' + FONT;
      ctx.fillText(isGood ? def.goodText : def.badText, 990, y);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#ece7e1';
      roundRect(ctx, 90, y + 22, 900, 16, 8);
      ctx.fill();
      var barGrad = ctx.createLinearGradient(90, 0, 990, 0);
      if (isGood) {
        barGrad.addColorStop(0, '#7db3cd');
        barGrad.addColorStop(1, '#2f6a8c');
      } else {
        barGrad.addColorStop(0, '#e6b184');
        barGrad.addColorStop(1, '#c4763a');
      }
      ctx.fillStyle = barGrad;
      roundRect(ctx, 90, y + 22, Math.max(16, 900 * clamp(value, 0, 100) / 100), 16, 8);
      ctx.fill();
      y += 92;
    });

    /* 真实测评里，你可能会遇到 */
    var boxTop = y + 16;
    var sceneLines = estimateLines(ctx, res.scene, 800, 32);
    var sceneHeight = 104 + sceneLines * 50;

    ctx.fillStyle = '#fdf4ea';
    roundRect(ctx, 50, boxTop, W - 100, sceneHeight, 32);
    ctx.fill();

    ctx.fillStyle = '#a8632c';
    ctx.font = 'bold 32px ' + FONT;
    ctx.fillText('真实测评里，你可能会遇到', 100, boxTop + 62);

    ctx.fillStyle = '#7a5330';
    ctx.font = '32px ' + FONT;
    wrapText(ctx, res.scene, 100, boxTop + 122, 800, 50);

    var cursor = boxTop + sceneHeight + 62;

    /* 下一步：三条建议 */
    ctx.fillStyle = '#2a2e33';
    ctx.font = 'bold 34px ' + FONT;
    ctx.fillText('下一步这样做', 90, cursor);
    cursor += 54;

    ctx.font = '30px ' + FONT;
    res.advice.forEach(function (line) {
      if (cursor > 1820) return;
      ctx.fillStyle = '#2f6a8c';
      ctx.fillText('·', 92, cursor);
      ctx.fillStyle = '#4a525c';
      var end = wrapText(ctx, line, 122, cursor, 810, 44).end;
      cursor = Math.min(end + 10, 1860);
    });

    /* 适合方向 */
    if (cursor < 1780) {
      cursor += 16;
      ctx.fillStyle = '#2a2e33';
      ctx.font = 'bold 30px ' + FONT;
      ctx.fillText('适合方向', 92, cursor);
      ctx.fillStyle = '#5d6672';
      ctx.font = '30px ' + FONT;
      var fitEnd = wrapText(ctx, res.fit, 220, cursor, 700, 44).end;
      cursor = Math.max(cursor + 40, fitEnd);
    }

    /* 页脚 */
    ctx.fillStyle = '#b9b2a9';
    ctx.font = '24px ' + FONT;
    wrapText(ctx, XHS_DISCLAIMER, 90, Math.max(Math.min(cursor + 42, 1832), 1778), 900, 36);
  }

  function estimateLines(ctx, text, maxWidth, fontSize) {
    ctx.font = fontSize + 'px ' + FONT;
    var line = '';
    var count = 1;
    for (var i = 0; i < text.length; i++) {
      var test = line + text.charAt(i);
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        count += 1;
        line = text.charAt(i);
      } else {
        line = test;
      }
    }
    return count;
  }

  /* ---------------- 端能力（容器内可用，浏览器里降级） ---------------- */

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
      // 兜底：普通浏览器里没有容器能力，直接下载图片
      try {
        var link = document.createElement('a');
        link.setAttribute('href', dataUrl);
        link.setAttribute('download', '校招测评自测.png');
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
    var res = current.result;
    var content = '我的校招测评自测：' + res.name + '（' + res.level + '）\n\n' +
      res.oneLine + '\n\n' + res.scene + '\n\n' + XHS_DISCLAIMER;
    if (!api || !api.postNote) {
      // 兜底：普通浏览器里没有发布能力，把文案备好让用户复制
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
          title: '我的校招测评作答画像',
          content: content.slice(0, 1000),
          tags: '#校招 #秋招 #测评 #求职',
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
      resLevel: document.getElementById('res-level'),
      resName: document.getElementById('res-name'),
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

  function init() {
    cacheEls();
    injectWebNav();
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
    el.disclaimer.textContent = XHS_DISCLAIMER;
    el.btnStart.addEventListener('click', startQuiz);
    el.btnRestart.addEventListener('click', startQuiz);
    el.btnPrev.addEventListener('click', goPrev);
    el.btnSave.addEventListener('click', saveCard);
    el.btnShare.addEventListener('click', shareNote);
    renderLast();
    showScreen('screen-intro');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
