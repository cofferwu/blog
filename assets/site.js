// ===== 暗色模式 =====
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  function icon(t) { return t === 'dark' ? '☀' : '☾'; }
  toggle.textContent = icon(root.dataset.theme);
  toggle.addEventListener('click', function () {
    var t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    toggle.textContent = icon(t);
  });
})();

// ===== 文章页：构建目录 =====
var tocList = document.querySelector('.toc .toc-list');
if (tocList) {
  var heads = Array.prototype.slice.call(document.querySelectorAll('.post h2[id]'));
  if (!heads.length) {
    var t = document.querySelector('.toc');
    if (t) t.style.display = 'none';
  } else {
    var html = '';
    heads.forEach(function (h) {
      html += '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>';
    });
    tocList.innerHTML = html;
  }
}

// ===== 首页：搜索 + 分类 + 标签/月份参数 + 分页（每页 10 篇） =====
var PER_PAGE = 10, curCat = 'all', curPage = 1, query = '', curTag = null, curMonth = null;
var rows = Array.prototype.slice.call(document.querySelectorAll('#list .row'));
var params = new URLSearchParams(location.search);
if (params.get('tag')) curTag = params.get('tag');
if (params.get('month') && /^\d{4}-\d{2}$/.test(params.get('month'))) curMonth = params.get('month');

function rowTags(r) { return (r.dataset.tags || '').split(',').filter(function (s) { return s; }); }
function visibleRows() {
  return rows.filter(function (r) {
    if (curCat !== 'all' && r.dataset.cat !== curCat) return false;
    if (curMonth && (r.dataset.date || '').indexOf(curMonth) !== 0) return false;
    if (curTag && rowTags(r).indexOf(curTag) === -1) return false;
    if (!query) return true;
    var hay = (r.textContent + (r.dataset.tags || '')).toLowerCase();
    return query.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  });
}
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function syncUrl() {
  var p = new URLSearchParams();
  if (curTag) p.set('tag', curTag);
  if (curMonth) p.set('month', curMonth);
  history.replaceState(null, '', p.toString() ? location.pathname + '?' + p : location.pathname);
}
function renderHome() {
  var docs = visibleRows();
  var pages = Math.max(1, Math.ceil(docs.length / PER_PAGE));
  if (curPage > pages) curPage = pages;
  var start = (curPage - 1) * PER_PAGE;
  rows.forEach(function (r) { r.style.display = 'none'; });
  docs.slice(start, start + PER_PAGE).forEach(function (r) { r.style.display = ''; });
  var empty = document.getElementById('empty');
  if (empty) empty.style.display = docs.length ? 'none' : 'block';

  var hint = document.getElementById('resultHint');
  if (hint) {
    var h = '';
    if (curMonth) h += '📅 <b>' + curMonth.replace('-', ' 年 ') + ' 月</b>发布 · ' + docs.length + ' 篇 <button class="clear" id="clearMonth">清除月份</button>';
    if (curTag) h += (curMonth ? ' · ' : '') + '标签「<b>' + esc(curTag) + '</b>」 · ' + docs.length + ' 篇 <button class="clear" id="clearTag">清除标签</button>';
    if (query) h += (h ? ' · ' : '') + '搜索「<b>' + esc(query) + '</b>」命中 <b>' + docs.length + '</b> 篇';
    hint.style.display = h ? 'flex' : 'none';
    hint.innerHTML = h;
    var cm = document.getElementById('clearMonth');
    if (cm) cm.addEventListener('click', function () { curMonth = null; curPage = 1; syncUrl(); renderHome(); });
    var ct = document.getElementById('clearTag');
    if (ct) ct.addEventListener('click', function () { curTag = null; curPage = 1; syncUrl(); renderHome(); });
  }

  var bar = document.getElementById('pagerbar');
  if (!bar) return;
  if (pages <= 1) { bar.innerHTML = ''; return; }
  var ph = '<button class="pbtn" data-p="' + (curPage - 1) + '"' + (curPage <= 1 ? ' disabled' : '') + '>‹ 上一页</button>';
  for (var i = 1; i <= pages; i++)
    ph += '<button class="pbtn' + (i === curPage ? ' on' : '') + '" data-p="' + i + '">' + i + '</button>';
  ph += '<button class="pbtn" data-p="' + (curPage + 1) + '"' + (curPage >= pages ? ' disabled' : '') + '>下一页 ›</button>'
     + '<span class="pinfo">第 ' + curPage + ' / ' + pages + ' 页 · 共 ' + docs.length + ' 篇</span>';
  bar.innerHTML = ph;
  bar.querySelectorAll('.pbtn[data-p]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = parseInt(b.dataset.p, 10);
      if (p >= 1 && p <= pages && p !== curPage) {
        curPage = p; renderHome();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
var filterbar = document.getElementById('filterbar');
if (filterbar && rows.length) {
  filterbar.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () {
      filterbar.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      curCat = c.dataset.cat; curPage = 1;
      renderHome();
    });
  });
}
var search = document.getElementById('search');
if (search) {
  search.addEventListener('input', function () {
    query = this.value.trim(); curPage = 1; renderHome();
  });
}
if (rows.length) renderHome();

// ===== 文章页：阅读进度条 + 阅读时长 =====
var post = document.querySelector('.post');
var pbar = document.getElementById('pbar');
if (pbar) {
  window.addEventListener('scroll', function () {
    var h = document.body.scrollHeight - window.innerHeight;
    pbar.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
  });
}
var readinfo = document.getElementById('readinfo');
if (readinfo && post) {
  var chars = post.innerText.replace(/\s+/g, '').length;
  var mins = Math.max(1, Math.round(chars / 300));
  var k = chars >= 1000 ? (chars / 1000).toFixed(1) + 'k' : chars;
  readinfo.innerHTML = '<span class="sep">·</span>全文 ' + k + ' 字<span class="sep">·</span>预计阅读 ' + mins + ' 分钟';
}

// ===== 文章页：相关文章 + 标签云（由 articleData JSON 计算） =====
var dataEl = document.getElementById('articleData');
if (dataEl && post) {
  var docs2 = [];
  try { docs2 = JSON.parse(dataEl.textContent); } catch (e) {}
  var me = location.pathname;
  var cur = null;
  docs2.forEach(function (d) { if (me.indexOf(d.u) === me.length - d.u.length || d.u === me) cur = d; });
  if (!cur && docs2.length) cur = docs2.filter(function (d) { return me.indexOf(d.u) !== -1; })[0];

  // 相关文章：按共同标签数排序取 3
  if (cur) {
    var scored = docs2.filter(function (d) { return d.u !== cur.u; }).map(function (d) {
      var n = d.g.filter(function (t) { return cur.g.indexOf(t) !== -1; }).length;
      return { d: d, n: n };
    }).filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 3);
    if (scored.length) {
      var rel = document.getElementById('related');
      var grid = document.getElementById('relGrid');
      rel.style.display = '';
      grid.innerHTML = scored.map(function (x) {
        return '<a class="rel-card" href="' + x.d.u + '"><div class="rc-meta">' + x.d.d + ' · ' + esc(x.d.c) + '</div><div class="rc-title">' + esc(x.d.t) + '</div></a>';
      }).join('');
    }
  }

  // 标签云：全站标签计数，链接到首页 ?tag=
  if (docs2.length) {
    var home = location.pathname.replace(/[^/]*$/, '');
    var cnt = {};
    docs2.forEach(function (d) { d.g.forEach(function (t) { cnt[t] = (cnt[t] || 0) + 1; }); });
    var tags = Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a]; });
    var card = document.getElementById('tagCard');
    var cloud = document.getElementById('tagcloud');
    card.style.display = '';
    cloud.innerHTML = tags.map(function (t) {
      return '<a class="tag" href="' + home + '?tag=' + encodeURIComponent(t) + '">' + esc(t) + '<span class="cnt">' + cnt[t] + '</span></a>';
    }).join('');
  }
}

// ===== 视频懒加载门面（facade）：打开页面不拉流，点击封面才加载播放 =====
document.querySelectorAll('.post video').forEach(function (v) {
  var wrap = document.createElement('div');
  wrap.className = 'vid-facade';
  var cover = document.createElement('div');
  cover.className = 'cover';
  if (v.poster) {
    var img = document.createElement('img');
    img.src = v.poster;
    img.alt = '视频封面';
    img.loading = 'lazy';
    cover.appendChild(img);
  }
  var play = document.createElement('div');
  play.className = 'play';
  var spinner = document.createElement('div');
  spinner.className = 'spinner';
  var label = document.createElement('span');
  label.className = 'label';
  label.textContent = '▶ 点击播放视频';
  cover.appendChild(play);
  cover.appendChild(spinner);
  cover.appendChild(label);
  v.style.display = 'none';
  v.removeAttribute('controls');      // 门面期隐藏控制条
  v.parentNode.insertBefore(wrap, v);
  wrap.appendChild(cover);
  wrap.appendChild(v);
  var started = false;
  wrap.addEventListener('click', function () {
    if (started) return;
    started = true;
    wrap.classList.add('loading');    // 显示加载动画
    v.controls = true;
    v.style.display = '';
    v.load();                          // 此时才开始拉流
    var onReady = function () {
      wrap.classList.add('playing');  // 隐藏门面
      v.play().catch(function () {});
    };
    v.addEventListener('canplay', onReady, { once: true });
    // 兜底：8 秒仍未 canplay 则直接显示播放器（可能已缓冲一部分）
    setTimeout(function () {
      if (!wrap.classList.contains('playing')) wrap.classList.add('playing');
    }, 8000);
  });
});

// ===== 文章页：代码复制 =====
document.querySelectorAll('.post pre').forEach(function (pre) {
  var wrap = pre.closest('.codehilite, .highlighter-rouge, .highlight') || pre.parentElement;
  if (!wrap) return;
  var btn = document.createElement('button');
  btn.className = 'copy-btn'; btn.textContent = '复制';
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(pre.innerText).then(function () {
      btn.textContent = '已复制';
      setTimeout(function () { btn.textContent = '复制'; }, 1500);
    });
  });
  wrap.appendChild(btn);
});
// 图片灯箱
var lb = document.createElement('div');
lb.id = 'lightbox';
document.body.appendChild(lb);
lb.addEventListener('click', function () { lb.style.display = 'none'; });
document.querySelectorAll('.post img').forEach(function (img) {
  if (img.closest('.vid-facade')) return;   // 视频门面封面不进灯箱
  img.addEventListener('click', function () {
    lb.innerHTML = ''; var big = document.createElement('img');
    big.src = img.src; lb.appendChild(big); lb.style.display = 'flex';
  });
});
// 目录高亮
var tocLinks = document.querySelectorAll('.toc a');
if (tocLinks.length && 'IntersectionObserver' in window) {
  var heads2 = document.querySelectorAll('.post h2[id]');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        tocLinks.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id); });
      }
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  heads2.forEach(function (h) { io.observe(h); });
}
// 回到顶部
var top = document.createElement('button');
top.textContent = '↑ 顶部';
top.style.cssText = 'position:fixed;right:22px;bottom:22px;border:1px solid var(--border);background:var(--card);border-radius:10px;padding:8px 14px;cursor:pointer;color:var(--muted);display:none;z-index:60;font-size:13px;';
document.body.appendChild(top);
window.addEventListener('scroll', function () { top.style.display = window.scrollY > 600 ? 'block' : 'none'; });
top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
