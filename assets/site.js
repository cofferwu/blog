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
// 分类筛选
document.querySelectorAll('.chip').forEach(function (c) {
  c.addEventListener('click', function () {
    document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
    c.classList.add('on');
    var cat = c.dataset.cat;
    document.querySelectorAll('.card').forEach(function (card) {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});
// 代码复制
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
