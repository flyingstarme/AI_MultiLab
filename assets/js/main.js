// AI_MultiLab 站点脚本：手机导航折叠、首页轮播、滚动新闻、图片灯箱、论文筛选。
// 不依赖任何第三方库，也不从外部 CDN 加载资源。
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EN = document.documentElement.lang === 'en';
  var TXT = EN
    ? { slide: 'Slide ', prev: 'Previous', next: 'Next', close: 'Close', viewer: 'Image viewer' }
    : { slide: '第 ', prev: '上一张', next: '下一张', close: '关闭', viewer: '图片浏览' };
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // ---------- 手机端导航折叠 ----------
  var nav = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---------- 首页轮播 ----------
  each(document.querySelectorAll('.carousel'), function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = track ? track.children : [];
    var n = slides.length;
    if (n < 2) return;
    var dotsBox = root.querySelector('.carousel-dots');
    var interval = parseInt(root.getAttribute('data-interval'), 10) || 4000;
    var index = 0;
    var timer = null;
    var dots = [];

    function go(i) {
      index = (i + n) % n;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
      for (var k = 0; k < n; k++) slides[k].inert = k !== index;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    // 始终自动轮播（系统关闭了动画效果时，切换没有滑动动画，但仍会自动换图）
    var hover = false;
    function start() {
      stop();
      timer = setInterval(function () { go(index + 1); }, interval);
    }
    // 手动切换后重新计时，鼠标不在图上就继续自动轮播
    function nav(i) { go(i); if (!hover) start(); }

    for (var i = 0; i < n; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', TXT.slide + (i + 1) + (EN ? '' : ' 张'));
      b.addEventListener('click', nav.bind(null, i));
      dotsBox.appendChild(b);
      dots.push(b);
    }
    root.querySelector('.carousel-prev').addEventListener('click', function () { nav(index - 1); });
    root.querySelector('.carousel-next').addEventListener('click', function () { nav(index + 1); });
    // 鼠标停在图上时暂停，移开后继续
    root.addEventListener('mouseenter', function () { hover = true; stop(); });
    root.addEventListener('mouseleave', function () { hover = false; start(); });

    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
      start();
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

    go(0);
    start();
  });

  // ---------- 首页滚动新闻 ----------
  // 内容高过方框时，把条目复制一份接在后面，整体匀速向上滚动；鼠标悬停或键盘聚焦时暂停。
  each(document.querySelectorAll('.news-box'), function (box) {
    var list = box.querySelector('.news-list');
    if (!list || reduceMotion) return;
    var h = list.scrollHeight;
    if (h <= box.clientHeight) return;
    each(Array.prototype.slice.call(list.children), function (li) {
      var c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      each(c.querySelectorAll('a'), function (a) { a.tabIndex = -1; });
      list.appendChild(c);
    });
    box.style.setProperty('--news-duration', Math.max(12, Math.round(h / 24)) + 's');
    box.classList.add('is-scrolling');
  });

  // ---------- 图片灯箱 ----------
  // 用法：<a href="大图" data-lightbox="分组名" data-caption="说明"><img src="缩略图"></a>
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
  if (links.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', TXT.viewer);
    lb.innerHTML =
      '<span class="lb-counter"></span>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="lb-prev" aria-label="' + TXT.prev + '">&#8249;</button>' +
      '<button type="button" class="lb-next" aria-label="' + TXT.next + '">&#8250;</button>' +
      '<button type="button" class="lb-close" aria-label="' + TXT.close + '">&times;</button>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var lbCount = lb.querySelector('.lb-counter');
    var btnPrev = lb.querySelector('.lb-prev');
    var btnNext = lb.querySelector('.lb-next');
    var btnClose = lb.querySelector('.lb-close');
    var group = [];
    var pos = 0;
    var lastFocus = null;

    var show = function (i) {
      pos = (i + group.length) % group.length;
      var a = group[pos];
      var thumb = a.querySelector('img');
      var caption = a.getAttribute('data-caption') || '';
      lbImg.src = a.href;
      lbImg.alt = caption || (thumb ? thumb.alt : '');
      lbCap.textContent = caption;
      lbCount.textContent = group.length > 1 ? (pos + 1) + ' / ' + group.length : '';
      btnPrev.hidden = btnNext.hidden = group.length < 2;
    };
    var open = function (a) {
      var name = a.getAttribute('data-lightbox');
      group = links.filter(function (x) { return x.getAttribute('data-lightbox') === name; });
      lastFocus = document.activeElement;
      show(group.indexOf(a));
      lb.classList.add('open');
      document.body.classList.add('lb-lock');
      btnClose.focus();
    };
    var close = function () {
      lb.classList.remove('open');
      document.body.classList.remove('lb-lock');
      lbImg.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    };

    links.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); open(a); });
    });
    btnPrev.addEventListener('click', function () { show(pos - 1); });
    btnNext.addEventListener('click', function () { show(pos + 1); });
    btnClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(pos - 1);
      else if (e.key === 'ArrowRight') show(pos + 1);
      else if (e.key === 'Tab') {
        // 焦点只在灯箱的按钮之间循环
        var f = [btnPrev, btnNext, btnClose].filter(function (b) { return !b.hidden; });
        var k = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) show(pos + (dx < 0 ? 1 : -1));
      tx = null;
    });
  }

  // ---------- 页脚访客统计（Vercount） ----------
  // 先显示本浏览器上次拿到的数字，再向 Vercount 请求最新数字；失败自动重试 3 次。
  // 显示的数字 = Vercount 的计数 + hugo.toml 里的基数（换服务前不蒜子已累计的数）。
  each(document.querySelectorAll('.visit-stats[data-counter]'), function (box) {
    var basePv = parseInt(box.getAttribute('data-base-pv'), 10) || 0;
    var baseUv = parseInt(box.getAttribute('data-base-uv'), 10) || 0;
    var pvEl = box.querySelector('[data-k="pv"]');
    var uvEl = box.querySelector('[data-k="uv"]');
    var CACHE = 'ai-multilab-visits';
    var show = function (d) {
      pvEl.textContent = String((Number(d.site_pv) || 0) + basePv);
      uvEl.textContent = String((Number(d.site_uv) || 0) + baseUv);
      box.hidden = false;
    };
    try { var cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); if (cached) show(cached); } catch (e) {}

    // 只在正式网站上计数（本地预览、双击打开的离线页面不计数）
    var host = location.hostname;
    if (!/^https?:$/.test(location.protocol) || host === 'localhost' || host === '127.0.0.1') return;

    // 同一浏览器一年内只算一个访客（与 Vercount 官方脚本相同的 cookie）
    var cookieName = 'vercount_uv_' + location.host.replace(/[^a-zA-Z0-9_-]/g, '_');
    var isNewUv = document.cookie.split('; ').indexOf(cookieName + '=1') < 0;
    if (isNewUv) document.cookie = cookieName + '=1; path=/; max-age=31536000; samesite=lax';

    var attempt = function (n) {
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
      fetch('https://events.vercount.one/api/v2/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: location.href, isNewUv: isNewUv && n === 1 }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (j) {
        clearTimeout(timer);
        var d = (j && j.data) || j || {};
        if (d.site_pv === undefined) throw new Error('bad data');
        try { localStorage.setItem(CACHE, JSON.stringify({ site_pv: d.site_pv, site_uv: d.site_uv })); } catch (e) {}
        show(d);
      }).catch(function () {
        clearTimeout(timer);
        if (n < 3) setTimeout(function () { attempt(n + 1); }, 3000 * n);
      });
    };
    attempt(1);
  });

  // ---------- 论文按研究方向筛选 ----------
  each(document.querySelectorAll('.pub-filter'), function (bar) {
    var scope = document.querySelector(bar.getAttribute('data-target')) || document;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      each(bar.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var key = btn.getAttribute('data-filter');
      each(scope.querySelectorAll('.pub-list li'), function (li) {
        li.hidden = key !== 'all' && li.getAttribute('data-direction') !== key;
      });
      each(scope.querySelectorAll('.pub-block'), function (blk) {
        blk.hidden = !blk.querySelector('.pub-list li:not([hidden])');
      });
    });
    // 从研究方向页点“全部 N 篇”过来时，网址带 #方向，自动筛选
    var hash = location.hash.slice(1);
    if (/^[a-z0-9-]+$/.test(hash)) {
      var preset = bar.querySelector('button[data-filter="' + hash + '"]');
      if (preset) preset.click();
    }
  });
})();
