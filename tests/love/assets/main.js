/* 我们的恋爱说明书 —— 主逻辑（v2：20 题 / 6 维度 / 雷达图 / 第一人称）
 * 容器约束：无联网、无内联脚本、无动态执行代码、无后台线程，事件全部用 addEventListener 绑定。
 * 端能力：window.xhs.miniTool（writeTempFile / saveImageToPhotosAlbum / postNote），调用前一律判空并降级。
 * 口径：「我」＝先作答的那位，「Ta」＝后来作答的那位。
 */

(function () {
  'use strict';

  var TOTAL = XHS_QUESTIONS.length;
  var DIMS = XHS_DIMS;
  var N = DIMS.length;
  var STORE_KEY = 'xhs_couple_profile_v2';
  var NEXT_DELAY = 260;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var FONT = '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif';
  var COLOR_A = '#e0578a';
  var COLOR_B = '#ef9a58';

  var state = {
    round: 'A',
    index: 0,
    answers: { A: [], B: [] },
    order: [],
    locked: false,
    guess: false
  };

  var el = {};
  var solo = null;
  var couple = null;

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
      return seededShuffle([0, 1, 2, 3], q.id * 6151 + 29);
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
    ['screen-intro', 'screen-quiz', 'screen-solo', 'screen-couple', 'screen-code'].forEach(function (sid) {
      var node = document.getElementById(sid);
      if (node) node.classList.toggle('active', sid === id);
    });
    window.scrollTo(0, 0);
  }

  function save() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ A: state.answers.A, B: state.answers.B }));
    } catch (e) {
      /* 存储不可用时静默跳过 */
    }
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- 爱情元素 ---------------- */

  // 背景持续上升的爱心
  function plantHearts() {
    var layer = document.getElementById('hearts-layer');
    if (!layer) return;
    var total = 10;
    for (var i = 0; i < total; i++) {
      var h = document.createElement('div');
      h.className = 'heart';
      h.textContent = i % 3 === 0 ? '♥' : '♡';
      h.style.left = (4 + Math.random() * 90).toFixed(1) + '%';
      h.style.fontSize = (13 + Math.random() * 14).toFixed(0) + 'px';
      h.style.animationDuration = (8 + Math.random() * 6).toFixed(1) + 's';
      h.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      h.style.setProperty('--peak', (0.2 + Math.random() * 0.24).toFixed(2));
      h.style.setProperty('--drift', (Math.random() * 40 - 20).toFixed(0) + 'px');
      if (i % 4 === 0) h.style.color = '#ef9a58';
      layer.appendChild(h);
    }
  }

  // 点选时从点击位置冒出一颗心
  function heartBurst(ev) {
    var x = 195;
    var y = 320;
    if (ev && ev.clientX) {
      x = ev.clientX;
      y = ev.clientY;
    }
    var b = document.createElement('div');
    b.className = 'heart-burst';
    b.textContent = '♥';
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.style.fontSize = (16 + Math.random() * 8).toFixed(0) + 'px';
    document.body.appendChild(b);
    window.setTimeout(function () {
      if (b.parentNode) b.parentNode.removeChild(b);
    }, 950);
  }

  /* ---------------- 答题流程 ---------------- */

  function startRound(round) {
    state.round = round;
    state.index = 0;
    state.answers[round] = [];
    state.locked = false;
    if (round === 'A') state.guess = false;
    buildOrder();
    el.whoLabel.textContent = round === 'A' ? '♡ 现在答题的是：我' : '♡ 现在答题的是：Ta';
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
      if (state.answers[state.round][state.index] === origIdx) btn.classList.add('picked');
      btn.addEventListener('click', function (ev) {
        heartBurst(ev);
        pick(origIdx, btn);
      });
      el.optWrap.appendChild(btn);
    });

    state.locked = false;
  }

  function pick(origIdx, btn) {
    if (state.locked) return;
    state.locked = true;

    state.answers[state.round][state.index] = origIdx;
    Array.prototype.forEach.call(el.optWrap.children, function (node) {
      node.disabled = true;
    });
    btn.classList.add('picked');

    window.setTimeout(function () {
      if (state.index >= TOTAL - 1) {
        save();
        if (state.round === 'A') {
          renderSolo('A');
        } else {
          // Ta 答完后，先给 Ta 自己的说明书，再进双人结果
          renderSolo('B');
        }
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

  function dimScores(answers) {
    var sums = {};
    var counts = {};
    DIMS.forEach(function (d) {
      sums[d.key] = 0;
      counts[d.key] = 0;
    });

    XHS_QUESTIONS.forEach(function (q, i) {
      var pickedIdx = answers[i];
      if (pickedIdx === undefined) pickedIdx = 0;
      sums[q.dim] += q.opts[pickedIdx].lv;
      counts[q.dim] += 1;
    });

    var scores = {};
    DIMS.forEach(function (d) {
      scores[d.key] = counts[d.key] ? Math.round((sums[d.key] / (counts[d.key] * 3)) * 100) : 0;
    });
    return scores;
  }

  function levelLabel(dim, score) {
    if (score >= 65) return '偏 ' + dim.highLabel;
    if (score <= 35) return '偏 ' + dim.lowLabel;
    return '中间';
  }

  // 称号键：维度 + 高分端/低分端
  function titleKey(dim, score) {
    var high = score >= 50;
    if (dim.key === 'express') return high ? 'expressHigh' : 'expressLow';
    if (dim.key === 'conflict') return high ? 'conflictHigh' : 'conflictLow';
    if (dim.key === 'space') return high ? 'spaceHigh' : 'spaceLow';
    if (dim.key === 'care') return high ? 'careHigh' : 'careLow';
    if (dim.key === 'comfort') return high ? 'comfortHigh' : 'comfortLow';
    return high ? 'shareHigh' : 'shareLow';
  }

  function soloTitle(scores) {
    var sorted = DIMS.slice().sort(function (a, b) {
      return scores[b.key] - scores[a.key];
    });
    var t = XHS_TITLES[titleKey(sorted[0], scores[sorted[0].key])];
    var sub = XHS_SUB_LABELS[titleKey(sorted[1], scores[sorted[1].key])];
    return { name: t.name, line: t.line, sub: sub };
  }

  function matchTier(score) {
    for (var i = 0; i < XHS_MATCH_TIERS.length; i++) {
      if (score >= XHS_MATCH_TIERS[i].min) return XHS_MATCH_TIERS[i];
    }
    return XHS_MATCH_TIERS[XHS_MATCH_TIERS.length - 1];
  }

  /* ---------------- 答案码（异地模式） ----------------
   * 纯离线方案：把 6 个维度的原始得分各用 4 bit 打包（共 24 bit），
   * 编码成 5 个字符 + 1 位校验，共 6 位。无损——同一个人输自己的码，重合度就是 100。
   * 字符表剔除了 0/O、1/I 这类容易看错的字符。
   */

  var CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  var DIM_COUNT = {};
  DIMS.forEach(function (d) {
    DIM_COUNT[d.key] = 0;
  });
  XHS_QUESTIONS.forEach(function (q) {
    DIM_COUNT[q.dim] += 1;
  });

  // 由维度百分比反推原始得分（题库固定，映射一一对应，可精确还原）
  function sumsFromScores(scores) {
    return DIMS.map(function (d) {
      var max = DIM_COUNT[d.key] * 3;
      var best = 0;
      var bestDiff = Infinity;
      for (var s = 0; s <= max; s++) {
        var diff = Math.abs(Math.round((s / max) * 100) - scores[d.key]);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = s;
        }
      }
      return best;
    });
  }

  function encodeProfile(scores) {
    var sums = sumsFromScores(scores);
    var bits = 0;
    sums.forEach(function (s) {
      bits = (bits << 4) | (s & 15);
    });
    var out = '';
    for (var i = 4; i >= 0; i--) {
      out += CODE_ALPHABET.charAt((bits >> (i * 5)) & 31);
    }
    var sum = 0;
    for (var k = 0; k < out.length; k++) sum += CODE_ALPHABET.indexOf(out.charAt(k));
    return out + CODE_ALPHABET.charAt(sum % 32);
  }

  function decodeProfile(input) {
    var code = String(input || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (code.length !== 6) {
      return { ok: false, reason: '码应该是 6 位，你填了 ' + code.length + ' 位' };
    }
    var sum = 0;
    for (var i = 0; i < 5; i++) {
      var idx = CODE_ALPHABET.indexOf(code.charAt(i));
      if (idx < 0) return { ok: false, reason: '码里有不认识的字符（0、O、1、I 这类字母不会出现）' };
      sum += idx;
    }
    if (CODE_ALPHABET.charAt(sum % 32) !== code.charAt(5)) {
      return { ok: false, reason: '码好像抄错了一个字符，再核对一下' };
    }
    var bits = 0;
    for (var j = 0; j < 5; j++) bits = (bits << 5) | CODE_ALPHABET.indexOf(code.charAt(j));
    if (bits >= 16777216) {
      return { ok: false, reason: '这串码不是这一版测试生成的，让对方重新生成一次' };
    }
    var scores = {};
    var bad = false;
    DIMS.forEach(function (d, k) {
      var s = (bits >> (4 * (5 - k))) & 15;
      var max = DIM_COUNT[d.key] * 3;
      if (s > max) bad = true;
      scores[d.key] = Math.round((s / max) * 100);
    });
    if (bad) return { ok: false, reason: '码的内容不完整，让对方重新生成一次' };
    return { ok: true, scores: scores };
  }

  function prettyCode(code) {
    return code.slice(0, 3) + ' ' + code.slice(3);
  }

  function buildSolo(answers) {
    return buildSoloFromScores(dimScores(answers));
  }

  function buildSoloFromScores(scores) {
    var sorted = DIMS.slice().sort(function (a, b) {
      return scores[b.key] - scores[a.key];
    });
    var highest = sorted[0];
    var lowest = sorted[sorted.length - 1];
    var tips = [(scores[highest.key] >= 50 ? highest.tipHigh : highest.tipLow)];
    tips.push(scores[lowest.key] >= 50 ? lowest.tipHigh : lowest.tipLow);
    tips.push('把手机递给 Ta 再答一遍——差异在哪，比谁对谁错重要得多。');
    return { scores: scores, title: soloTitle(scores), highest: highest, lowest: lowest, tips: tips };
  }

  function buildCouple(a, b) {
    return buildCoupleFromScores(dimScores(a), dimScores(b));
  }

  function buildCoupleFromScores(sa, sb) {
    var rows = DIMS.map(function (d) {
      return { dim: d, a: sa[d.key], b: sb[d.key], diff: Math.abs(sa[d.key] - sb[d.key]) };
    });
    var byDiff = rows.slice().sort(function (x, y) { return x.diff - y.diff; });
    byDiff[0].role = 'same';
    byDiff[1].role = 'same';
    byDiff[byDiff.length - 1].role = 'gap';
    byDiff[byDiff.length - 2].role = 'gap';
    rows.forEach(function (r) {
      if (!r.role) r.role = 'mid';
    });
    var overlap = Math.round(100 - rows.reduce(function (sum, r) { return sum + r.diff; }, 0) / rows.length);
    overlap = clamp(overlap, 0, 100);

    // 组合类型：差异大小 + 差异方向是否一致
    var pos = 0;
    var neg = 0;
    rows.forEach(function (r) {
      var signed = r.a - r.b;
      if (signed > 8) pos += 1;
      if (signed < -8) neg += 1;
    });
    var dominant = (pos + neg) ? Math.max(pos, neg) / (pos + neg) : 0;
    // 组合类型与重合度分档保持同一套阈值，避免「大体同频」又「互补型」这种自相矛盾
    var typeKey;
    if (overlap >= 88) typeKey = 'tune';
    else if (overlap >= 72) typeKey = 'grind';
    else if (dominant >= 0.7) typeKey = 'complement';
    else typeKey = 'mismatch';

    return {
      rows: rows,
      same: [byDiff[0], byDiff[1]],
      gaps: [byDiff[byDiff.length - 1], byDiff[byDiff.length - 2]],
      overlap: overlap,
      tier: matchTier(overlap),
      type: XHS_PAIR_TYPES[typeKey],
      typeKey: typeKey
    };
  }

  /* ---------------- 雷达图 ---------------- */

  function radarPoint(cx, cy, radius, index, count, value) {
    var angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
    var r = radius * clamp(value, 0, 100) / 100;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  }

  function drawRadar(ctx, opts) {
    var cx = opts.cx;
    var cy = opts.cy;
    var radius = opts.radius;
    var series = opts.series;
    var labelSize = opts.labelSize || 26;
    var ringColor = opts.ringColor || '#f2e2e8';
    var labels = opts.labels;
    var i;
    var k;

    // 网格
    for (k = 1; k <= 4; k++) {
      ctx.beginPath();
      for (i = 0; i < N; i++) {
        var p = radarPoint(cx, cy, radius, i, N, k * 25);
        if (i === 0) ctx.moveTo(p[0], p[1]);
        else ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = k === 4 ? 3 : 2;
      ctx.stroke();
    }

    // 轴线
    for (i = 0; i < N; i++) {
      var edge = radarPoint(cx, cy, radius, i, N, 100);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(edge[0], edge[1]);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 数据多边形
    series.forEach(function (s) {
      ctx.beginPath();
      for (i = 0; i < N; i++) {
        var pt = radarPoint(cx, cy, radius, i, N, s.values[i]);
        if (i === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      }
      ctx.closePath();
      ctx.fillStyle = s.fill;
      ctx.fill();
      ctx.strokeStyle = s.stroke;
      ctx.lineWidth = 4;
      ctx.stroke();

      for (i = 0; i < N; i++) {
        var dot = radarPoint(cx, cy, radius, i, N, s.values[i]);
        ctx.beginPath();
        ctx.arc(dot[0], dot[1], 6, 0, Math.PI * 2);
        ctx.fillStyle = s.stroke;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // 维度名
    ctx.fillStyle = opts.labelColor || '#70595f';
    ctx.font = labelSize + 'px ' + FONT;
    for (i = 0; i < N; i++) {
      var angle = -Math.PI / 2 + (Math.PI * 2 * i) / N;
      var lx = cx + Math.cos(angle) * (radius + labelSize * 1.5);
      var ly = cy + Math.sin(angle) * (radius + labelSize * 1.15);
      var cos = Math.cos(angle);
      ctx.textAlign = cos > 0.3 ? 'left' : (cos < -0.3 ? 'right' : 'center');
      ctx.fillText(labels[i], lx, ly + labelSize * 0.35);
    }
    ctx.textAlign = 'left';
  }

  function dimValues(scores) {
    return DIMS.map(function (d) {
      return scores[d.key];
    });
  }

  function dimLabels() {
    return DIMS.map(function (d) {
      return d.name;
    });
  }

  function renderRadar(canvas, series, opts) {
    if (!canvas) return;
    var size = canvas.width;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    var radius = size * 0.31;
    drawRadar(ctx, {
      cx: size / 2,
      cy: size / 2,
      radius: radius,
      labels: dimLabels(),
      series: series,
      labelSize: opts && opts.labelSize ? opts.labelSize : size * 0.042,
      ringColor: opts && opts.ringColor ? opts.ringColor : '#f2e2e8',
      labelColor: opts && opts.labelColor ? opts.labelColor : '#70595f'
    });
  }

  /* ---------------- 单人结果渲染 ---------------- */

  function dimBlock(dim, score) {
    var box = document.createElement('div');
    box.className = 'metric';

    var head = document.createElement('div');
    head.className = 'metric-head';
    var label = document.createElement('span');
    label.textContent = dim.name;
    var chip = document.createElement('span');
    var extreme = score >= 65 || score <= 35;
    chip.className = 'chip ' + (extreme ? 'good' : 'bad');
    chip.textContent = levelLabel(dim, score);
    head.appendChild(label);
    head.appendChild(chip);

    var track = document.createElement('div');
    track.className = 'metric-track';
    var fill = document.createElement('div');
    fill.className = 'metric-fill';
    fill.style.width = score + '%';
    track.appendChild(fill);

    var hint = document.createElement('div');
    hint.className = 'metric-hint';
    hint.textContent = score >= 50 ? dim.highLine : dim.lowLine;

    box.appendChild(head);
    box.appendChild(track);
    box.appendChild(hint);
    return box;
  }

  function renderSolo(which) {
    var who = which || 'A';
    solo = buildSolo(state.answers[who]);
    solo.who = who;

    el.soloLevel.textContent = who === 'A' ? '第一份' : '第二份';
    el.soloName.textContent = solo.title.name;
    el.soloLine.textContent = solo.title.line;
    el.soloSub.textContent = solo.title.sub;
    el.soloCode.textContent = prettyCode(encodeProfile(solo.scores));
    el.nextA.style.display = who === 'A' ? 'block' : 'none';
    el.nextB.style.display = who === 'A' ? 'none' : 'block';

    renderRadar(el.radarSolo, [{
      values: dimValues(solo.scores),
      stroke: COLOR_A,
      fill: 'rgba(224, 87, 138, 0.20)'
    }]);

    clear(el.soloDims);
    DIMS.forEach(function (d) {
      el.soloDims.appendChild(dimBlock(d, solo.scores[d.key]));
    });

    clear(el.soloTips);
    var title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = '和我谈恋爱，可以这样做';
    el.soloTips.appendChild(title);
    var ul = document.createElement('ul');
    ul.className = 'list';
    solo.tips.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
    el.soloTips.appendChild(ul);

    drawSoloCard();
    showScreen('screen-solo');
  }

  /* ---------------- 双人结果渲染 ---------------- */

  function compareBlock(row) {
    var box = document.createElement('div');
    box.className = 'compare';

    var head = document.createElement('div');
    head.className = 'compare-head';
    var name = document.createElement('span');
    name.textContent = row.dim.name;
    var tag = document.createElement('span');
    tag.className = 'diff-tag' + (row.role === 'same' ? ' same' : '');
    tag.textContent = row.role === 'same' ? '很接近' : '需要磨合';
    head.appendChild(name);
    head.appendChild(tag);
    box.appendChild(head);

    [['a', '我', row.a], ['b', 'Ta', row.b]].forEach(function (item) {
      var line = document.createElement('div');
      line.className = 'bar-line';
      var who = document.createElement('span');
      who.className = 'bar-name ' + item[0];
      who.textContent = item[1].slice(0, 1);
      var track = document.createElement('div');
      track.className = 'bar-track';
      var fill = document.createElement('div');
      fill.className = 'bar-fill ' + item[0];
      fill.style.width = item[2] + '%';
      track.appendChild(fill);
      var val = document.createElement('span');
      val.className = 'bar-val';
      val.textContent = item[2];
      line.appendChild(who);
      line.appendChild(track);
      line.appendChild(val);
      box.appendChild(line);
    });

    return box;
  }

  function gapBlock(row, kind) {
    var wrap = document.createElement('div');
    wrap.style.marginBottom = '14px';

    var alike = kind === 'gap' && row.diff <= 12;
    var title = document.createElement('div');
    title.className = 'gap-title';
    title.textContent = alike
      ? row.dim.name + '：我们几乎完全一样'
      : row.dim.name + '：' + row.dim.lowLabel + ' ↔ ' + row.dim.highLabel;

    var text = document.createElement('p');
    text.className = 'gap-line';
    text.textContent = (kind === 'same' || alike) ? row.dim.sameLine : row.dim.diffLine;

    wrap.appendChild(title);
    wrap.appendChild(text);
    return wrap;
  }

  function renderCouple() {
    couple = buildCouple(state.answers.A, state.answers.B);
    el.guessNote.style.display = state.guess ? 'block' : 'none';
    showCouple();
  }

  function renderCoupleFromCode(theirScores) {
    couple = buildCoupleFromScores(dimScores(state.answers.A), theirScores);
    el.guessNote.style.display = 'none';
    showCouple();
  }

  function showCouple() {
    el.coupleLevel.textContent = couple.tier.label;
    el.coupleScore.textContent = '重合度 ' + couple.overlap;
    el.coupleLine.textContent = couple.tier.line;
    el.coupleType.textContent = '我们属于：' + couple.type.name;
    el.pairTypeLine.textContent = couple.type.line;
    el.pairTypeNote.textContent = couple.type.note;
    el.pairTypeTip.textContent = couple.type.tip;

    // 两个人的说明书称号，并列展示
    var scoresA = {};
    var scoresB = {};
    couple.rows.forEach(function (r) {
      scoresA[r.dim.key] = r.a;
      scoresB[r.dim.key] = r.b;
    });
    var titleA = buildSoloFromScores(scoresA).title;
    var titleB = buildSoloFromScores(scoresB).title;
    clear(el.pairNames);
    [['a', '我：' + titleA.name], ['b', 'Ta：' + titleB.name]].forEach(function (item) {
      var span = document.createElement('span');
      span.className = 'tag ' + item[0];
      span.textContent = item[1];
      el.pairNames.appendChild(span);
    });

    // 双心靠近：重合度越高，两颗心贴得越近
    if (el.heartPair) {
      var gap = (2 + (100 - couple.overlap) * 0.32).toFixed(1);
      el.heartPair.style.setProperty('--gap', '34px');
      window.setTimeout(function () {
        el.heartPair.style.setProperty('--gap', gap + 'px');
      }, 260);
    }
    if (el.pairCaption) {
      el.pairCaption.textContent = couple.overlap >= 88
        ? '六件事上几乎完全重合'
        : couple.overlap >= 72
          ? '方向一致，个别节奏不同'
          : couple.overlap >= 55
            ? '一半合拍，一半要磨合'
            : '差异明显，但互补也明显';
    }

    var sa = {};
    var sb = {};
    couple.rows.forEach(function (r) {
      sa[r.dim.key] = r.a;
      sb[r.dim.key] = r.b;
    });
    renderRadar(el.radarCouple, [
      { values: dimValues(sa), stroke: COLOR_A, fill: 'rgba(224, 87, 138, 0.20)' },
      { values: dimValues(sb), stroke: COLOR_B, fill: 'rgba(239, 154, 88, 0.20)' }
    ]);

    clear(el.compareWrap);
    couple.rows.forEach(function (row) {
      el.compareWrap.appendChild(compareBlock(row));
    });

    clear(el.sameWrap);
    couple.same.forEach(function (row) {
      el.sameWrap.appendChild(gapBlock(row, 'same'));
    });

    clear(el.diffWrap);
    couple.gaps.forEach(function (row) {
      el.diffWrap.appendChild(gapBlock(row, 'gap'));
    });

    el.coupleAdvice.textContent = couple.overlap >= 88
      ? '我们几乎没有明显分歧。' + couple.tier.note
      : '我们最大的差异在「' + couple.gaps[0].dim.name + '」这一格。' + couple.tier.note +
        '差异本身不是问题，把「Ta 是不是不爱我」换成「我们习惯不一样」，会顺很多。';

    drawCoupleCard();
    showScreen('screen-couple');
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

  function drawHeart(ctx, x, y, size, color) {
    var s = size;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(s * 0.55, -s * 0.28, s * 1.12, s * 0.28, 0, s * 0.98);
    ctx.bezierCurveTo(-s * 1.12, s * 0.28, -s * 0.55, -s * 0.28, 0, s * 0.32);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  // 卡片背景里散落的小爱心（很淡，不抢内容）
  function scatterHearts(ctx) {
    var spots = [
      [70, 1180, 26, 'rgba(240,121,159,0.35)'],
      [1000, 960, 20, 'rgba(239,154,88,0.32)'],
      [80, 1600, 22, 'rgba(240,121,159,0.3)'],
      [990, 1660, 26, 'rgba(239,154,88,0.28)'],
      [960, 430, 18, 'rgba(255,255,255,0.35)']
    ];
    spots.forEach(function (sp) {
      drawHeart(ctx, sp[0], sp[1], sp[2], sp[3]);
    });
  }

  function drawHero(ctx, eyebrow, chip, big, line, heartGap) {
    var grad = ctx.createLinearGradient(0, 40, 1080, 620);
    grad.addColorStop(0, '#f0799f');
    grad.addColorStop(1, '#d2457a');
    ctx.fillStyle = grad;
    roundRect(ctx, 50, 40, 980, 580, 46);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '30px ' + FONT;
    ctx.fillText(eyebrow, 100, 128);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    roundRect(ctx, 100, 158, 210, 52, 26);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px ' + FONT;
    ctx.fillText(chip, 128, 193);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 86px ' + FONT;
    ctx.fillText(big, 100, 320);

    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.font = '36px ' + FONT;
    var res = wrapText(ctx, line, 100, 400, 880, 54);

    var baseY = Math.min(Math.max(res.end + 24, 545), 585);
    if (typeof heartGap === 'number') {
      var heartY = baseY + 8;
      drawHeart(ctx, 118, heartY, 26, '#ffffff');
      drawHeart(ctx, 118 + heartGap, heartY, 26, '#ffd3ba');
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = '26px ' + FONT;
      ctx.fillText('重合度越高，两颗心贴得越近', 200, heartY + 10);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '26px ' + FONT;
      ctx.fillText('各 20 题原创恋爱自测', 100, baseY);
    }
  }

  function drawSoloCard() {
    var canvas = el.canvasSolo;
    var ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;

    ctx.fillStyle = '#fff9fb';
    ctx.fillRect(0, 0, 1080, 1920);

    drawHero(ctx, '我的恋爱说明书', '第一份', solo.title.name, solo.title.line, null);
    scatterHearts(ctx);

    var radarSize = 660;
    var radarTop = 660;
    var radarLeft = (1080 - radarSize) / 2;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, radarLeft - 20, radarTop - 20, radarSize + 40, radarSize + 40, 36);
    ctx.fill();
    drawRadar(ctx, {
      cx: 540,
      cy: radarTop + radarSize / 2,
      radius: 210,
      labels: dimLabels(),
      series: [{ values: dimValues(solo.scores), stroke: COLOR_A, fill: 'rgba(224, 87, 138, 0.22)' }],
      labelSize: 30,
      ringColor: '#f6e5eb',
      labelColor: '#70595f'
    });

    /* 我最明显的两件事（分享图里只放自己的内容，不放答案码） */
    var boxTop = radarTop + radarSize + 70;
    var ranked = DIMS.slice().sort(function (a, b) {
      return solo.scores[b.key] - solo.scores[a.key];
    }).slice(0, 2);

    ctx.fillStyle = '#fdeaf1';
    roundRect(ctx, 50, boxTop, 980, 300, 36);
    ctx.fill();

    ctx.fillStyle = '#c33c6d';
    ctx.font = 'bold 32px ' + FONT;
    ctx.fillText('我最明显的两件事', 100, boxTop + 66);

    ctx.font = '32px ' + FONT;
    ranked.forEach(function (d, idx) {
      var y = boxTop + 146 + idx * 64;
      ctx.fillStyle = '#8a4a66';
      ctx.fillText(d.name, 100, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#c33c6d';
      ctx.fillText(levelLabel(d, solo.scores[d.key]) + ' · ' + solo.scores[d.key], 980, y);
      ctx.textAlign = 'left';
    });

    ctx.fillStyle = '#a08d94';
    ctx.font = '26px ' + FONT;
    ctx.fillText('想看看两个人合不合？让 Ta 也做一遍同一套题。', 90, boxTop + 360);

    ctx.fillStyle = '#c9b3bb';
    ctx.font = '24px ' + FONT;
    wrapText(ctx, XHS_DISCLAIMER, 90, 1800, 900, 36);
  }

  function drawCoupleCard() {
    var canvas = el.canvasCouple;
    var ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;

    ctx.fillStyle = '#fff9fb';
    ctx.fillRect(0, 0, 1080, 1920);

    drawHero(ctx, '我们的恋爱说明书', couple.tier.label, '重合度 ' + couple.overlap, couple.tier.line,
      Math.max(34, 34 + (100 - couple.overlap) * 0.5));
    scatterHearts(ctx);

    var radarSize = 660;
    var radarTop = 640;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, 50, radarTop - 30, 980, radarSize + 40, 36);
    ctx.fill();

    var sa = {};
    var sb = {};
    couple.rows.forEach(function (r) {
      sa[r.dim.key] = r.a;
      sb[r.dim.key] = r.b;
    });

    drawRadar(ctx, {
      cx: 540,
      cy: radarTop + 0 + radarSize / 2,
      radius: 205,
      labels: dimLabels(),
      series: [
        { values: dimValues(sa), stroke: COLOR_A, fill: 'rgba(224, 87, 138, 0.22)' },
        { values: dimValues(sb), stroke: COLOR_B, fill: 'rgba(239, 154, 88, 0.22)' }
      ],
      labelSize: 29,
      ringColor: '#f6e5eb',
      labelColor: '#70595f'
    });

    // 图例
    ctx.fillStyle = COLOR_A;
    ctx.beginPath();
    ctx.arc(400, radarTop + radarSize + 12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#70595f';
    ctx.font = '28px ' + FONT;
    ctx.fillText('我', 425, radarTop + radarSize + 22);

    ctx.fillStyle = COLOR_B;
    ctx.beginPath();
    ctx.arc(530, radarTop + radarSize + 12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#70595f';
    ctx.fillText('Ta', 555, radarTop + radarSize + 22);

    var boxTop = radarTop + radarSize + 80;
    var gapText = '最合拍：' + couple.same[0].dim.name + '、' + couple.same[1].dim.name +
      '　｜　最需要磨合：' + couple.gaps[0].dim.name + '、' + couple.gaps[1].dim.name;
    ctx.fillStyle = '#fdf1e5';
    roundRect(ctx, 50, boxTop, 980, 250, 32);
    ctx.fill();
    ctx.fillStyle = '#c4763a';
    ctx.font = 'bold 34px ' + FONT;
    ctx.fillText('我们属于：' + couple.type.name, 100, boxTop + 74);
    ctx.fillStyle = '#8a5628';
    ctx.font = '30px ' + FONT;
    wrapText(ctx, gapText, 100, boxTop + 146, 880, 46);

    ctx.fillStyle = '#c9b3bb';
    ctx.font = '24px ' + FONT;
    wrapText(ctx, XHS_DISCLAIMER, 90, 1800, 900, 36);
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

  function saveCanvas(canvas) {
    var api = miniToolApi();
    var dataUrl = canvas.toDataURL('image/png');
    if (api && api.saveImageToPhotosAlbum) {
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
      return;
    }
    // 兜底：在普通浏览器里预览时容器 API 不存在，直接下载图片
    try {
      var link = document.createElement('a');
      link.setAttribute('href', dataUrl);
      link.setAttribute('download', '恋爱说明书.png');
      document.body.appendChild(link);
      link.click();
      window.setTimeout(function () {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 0);
      toast('图片已开始下载，检查一下浏览器的下载记录');
    } catch (e) {
      toast('这个环境不能自动保存，长按上面的图片也能存');
    }
  }

  function shareCanvas(canvas, text) {
    var api = miniToolApi();
    if (api && api.postNote) {
      toTempFile(canvas.toDataURL('image/png'))
        .then(function (filePath) {
          return api.postNote({
            title: '我们的恋爱说明书',
            content: text.slice(0, 1000),
            tags: '#情侣 #恋爱 #情侣测试 #相处',
            mediaInfo: { image_resources: [{ url: filePath }] }
          });
        })
        .catch(function () {
          toast('发笔记没成功，可以先保存图片再手动发布');
        });
      return;
    }
    // 兜底：普通浏览器里没有发布能力，就把文案准备好并选中，用户直接粘贴
    if (el.sharePanel) {
      el.shareText.value = text;
      el.sharePanel.style.display = 'block';
      window.setTimeout(function () {
        el.shareText.focus();
        el.shareText.select();
        el.shareText.scrollTop = 0;
      }, 60);
      el.sharePanel.scrollIntoView({ block: 'center' });
      toast('文案已经准备好了，复制后去小红书发笔记');
    }
  }

  /* ---------------- 初始化 ---------------- */

  function cacheEls() {
    el = {
      toast: document.getElementById('toast'),
      whoLabel: document.getElementById('who-label'),
      progressCount: document.getElementById('progress-count'),
      progressFill: document.getElementById('progress-fill'),
      qIndex: document.getElementById('q-index'),
      qText: document.getElementById('q-text'),
      optWrap: document.getElementById('opt-wrap'),
      btnPrev: document.getElementById('btn-prev'),
      btnStart: document.getElementById('btn-start'),
      btnResume: document.getElementById('btn-resume'),
      btnLast: document.getElementById('btn-last'),
      btnPartner: document.getElementById('btn-partner'),
      btnGuess: document.getElementById('btn-guess'),
      btnCodeOpen: document.getElementById('btn-code-open'),
      btnCodeSubmit: document.getElementById('btn-code-submit'),
      btnCodeBack: document.getElementById('btn-code-back'),
      codeInput: document.getElementById('code-input'),
      codeError: document.getElementById('code-error'),
      soloCode: document.getElementById('solo-code'),
      guessNote: document.getElementById('guess-note'),
      sharePanel: document.getElementById('share-panel'),
      shareText: document.getElementById('share-text'),
      btnShareReselect: document.getElementById('btn-share-reselect'),
      btnShareClose: document.getElementById('btn-share-close'),
      btnRestart: document.getElementById('btn-restart'),
      btnSoloSave: document.getElementById('btn-solo-save'),
      btnCoupleSave: document.getElementById('btn-couple-save'),
      btnCoupleShare: document.getElementById('btn-couple-share'),
      soloName: document.getElementById('solo-name'),
      soloLine: document.getElementById('solo-line'),
      soloSub: document.getElementById('solo-sub'),
      soloLevel: document.getElementById('solo-level'),
      soloDims: document.getElementById('solo-dims'),
      soloTips: document.getElementById('solo-tips'),
      nextA: document.getElementById('next-a'),
      nextB: document.getElementById('next-b'),
      btnSeeCouple: document.getElementById('btn-see-couple'),
      btnBSave: document.getElementById('btn-b-save'),
      radarSolo: document.getElementById('radar-solo'),
      radarCouple: document.getElementById('radar-couple'),
      coupleLevel: document.getElementById('couple-level'),
      coupleScore: document.getElementById('couple-score'),
      coupleLine: document.getElementById('couple-line'),
      coupleType: document.getElementById('couple-type'),
      pairTypeLine: document.getElementById('pair-type-line'),
      pairTypeNote: document.getElementById('pair-type-note'),
      pairTypeTip: document.getElementById('pair-type-tip'),
      pairNames: document.getElementById('pair-names'),
      compareWrap: document.getElementById('compare-wrap'),
      sameWrap: document.getElementById('same-wrap'),
      diffWrap: document.getElementById('diff-wrap'),
      coupleAdvice: document.getElementById('couple-advice'),
      heartPair: document.getElementById('heart-pair'),
      pairCaption: document.getElementById('pair-caption'),
      canvasSolo: document.getElementById('card-canvas'),
      canvasCouple: document.getElementById('card-canvas-couple'),
      disclaimerSolo: document.getElementById('disclaimer-solo'),
      disclaimerCouple: document.getElementById('disclaimer-couple')
    };
  }

  function renderIntro() {
    var saved = load();
    var hasA = saved && saved.A && saved.A.length === TOTAL;
    var hasB = saved && saved.B && saved.B.length === TOTAL;
    el.btnResume.style.display = hasA && !hasB ? 'block' : 'none';
    el.btnLast.style.display = hasB ? 'block' : 'none';
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
    plantHearts();
    injectWebNav();
    el.disclaimerSolo.textContent = XHS_DISCLAIMER;
    el.disclaimerCouple.textContent = XHS_DISCLAIMER;

    el.btnStart.addEventListener('click', function () {
      state.answers = { A: [], B: [] };
      startRound('A');
    });
    el.btnResume.addEventListener('click', function () {
      var saved = load();
      state.answers.A = (saved && saved.A) || [];
      state.answers.B = [];
      startRound('B');
    });
    el.btnLast.addEventListener('click', function () {
      var saved = load();
      if (!saved || !saved.A || !saved.B) return;
      state.answers.A = saved.A;
      state.answers.B = saved.B;
      renderSolo();
      renderCouple();
    });
    el.btnPartner.addEventListener('click', function () {
      state.guess = false;
      startRound('B');
    });
    el.btnSeeCouple.addEventListener('click', function () {
      renderCouple();
    });
    el.btnBSave.addEventListener('click', function () {
      saveCanvas(el.canvasSolo);
    });
    el.btnGuess.addEventListener('click', function () {
      state.guess = true;
      startRound('B');
    });
    el.btnCodeOpen.addEventListener('click', function () {
      el.codeInput.value = '';
      el.codeError.textContent = '';
      showScreen('screen-code');
      window.setTimeout(function () {
        el.codeInput.focus();
      }, 220);
    });
    el.btnCodeBack.addEventListener('click', function () {
      showScreen('screen-solo');
    });
    el.btnCodeSubmit.addEventListener('click', function () {
      var res = decodeProfile(el.codeInput.value);
      if (!res.ok) {
        el.codeError.textContent = res.reason;
        return;
      }
      el.codeError.textContent = '';
      renderCoupleFromCode(res.scores);
    });
    el.codeInput.addEventListener('input', function () {
      el.codeError.textContent = '';
    });
    el.codeInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        el.btnCodeSubmit.click();
      }
    });
    el.btnRestart.addEventListener('click', function () {
      state.answers = { A: [], B: [] };
      state.guess = false;
      renderIntro();
      showScreen('screen-intro');
    });
    el.btnPrev.addEventListener('click', goPrev);
    el.btnSoloSave.addEventListener('click', function () {
      saveCanvas(el.canvasSolo);
    });
    el.btnCoupleSave.addEventListener('click', function () {
      saveCanvas(el.canvasCouple);
    });
    el.btnCoupleShare.addEventListener('click', function () {
      shareCanvas(el.canvasCouple, '我们的恋爱说明书：重合度 ' + couple.overlap + '（' + couple.tier.label + '）\n\n' +
        couple.tier.line + '\n最容易卡住的是：' + couple.gaps[0].dim.name + '。\n\n' + XHS_DISCLAIMER);
    });
    el.btnShareClose.addEventListener('click', function () {
      el.sharePanel.style.display = 'none';
    });
    el.btnShareReselect.addEventListener('click', function () {
      el.shareText.focus();
      el.shareText.select();
      el.shareText.scrollTop = 0;
      toast('已选中，直接复制就行');
    });

    renderIntro();
    showScreen('screen-intro');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
