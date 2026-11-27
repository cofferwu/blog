// 构建文章目录（Jekyll 渲染，目录由前端生成）
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
// ===== 首页：分类筛选 + 分页（每页 10 篇） =====
var PER_PAGE = 10, curCat = 'all', curPage = 1;
var rows = Array.prototype.slice.call(document.querySelectorAll('#list .row'));

function visibleRows() {
  return curCat === 'all' ? rows : rows.filter(function (r) { return r.dataset.cat === curCat; });
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

  var bar = document.getElementById('pagerbar');
  if (!bar) return;
  if (pages <= 1) { bar.innerHTML = ''; return; }
  var h = '<button class="pbtn" data-p="' + (curPage - 1) + '"' + (curPage <= 1 ? ' disabled' : '') + '>‹ 上一页</button>';
  for (var i = 1; i <= pages; i++)
    h += '<button class="pbtn' + (i === curPage ? ' on' : '') + '" data-p="' + i + '">' + i + '</button>';
  h += '<button class="pbtn" data-p="' + (curPage + 1) + '"' + (curPage >= pages ? ' disabled' : '') + '>下一页 ›</button>'
     + '<span class="pinfo">第 ' + curPage + ' / ' + pages + ' 页 · 共 ' + docs.length + ' 篇</span>';
  bar.innerHTML = h;
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
  renderHome();
}
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
top.style.cssText = 'position:fixed;right:22px;bottom:22px;border:1px solid var(--border);background:#fff;border-radius:10px;padding:8px 14px;cursor:pointer;color:var(--muted);display:none;z-index:60;font-size:13px;';
document.body.appendChild(top);
window.addEventListener('scroll', function () { top.style.display = window.scrollY > 600 ? 'block' : 'none'; });
top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
