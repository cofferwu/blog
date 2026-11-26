# -*- coding: utf-8 -*-
"""在现有 main 上新增/更新站点文件（保留 images/），单次提交。"""
import os, sys, json, base64, urllib.request, urllib.error

TOK = os.environ['GH_TOKEN']
OWNER, REPO, BRANCH = 'cofferwu', 'blog', 'main'
SRC = r'C:\Users\cofferwu\WorkBuddy\2026-11-26-10-16-15\2026-11-26-13-05-00-site-build'
API = 'https://api.github.com'


def api(path, method='GET', data=None):
    body = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(API + path, method=method, data=body, headers={
        'Authorization': 'Bearer ' + TOK, 'Accept': 'application/vnd.github+json',
        'User-Agent': 'workbuddy', 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read().decode('utf-8')
            return r.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8', 'replace')[:300]


s, d = api('/repos/%s/%s/git/ref/heads/%s' % (OWNER, REPO, BRANCH))
if s != 200:
    sys.exit('REF FAIL %s %s' % (s, d))
head = d['object']['sha']
s, d = api('/repos/%s/%s/git/commits/%s' % (OWNER, REPO, head))
base_tree = d['tree']['sha']
print('HEAD', head, 'BASE_TREE', base_tree)

files = []
for root, dirs, fs in os.walk(SRC):
    for f in sorted(fs):
        lp = os.path.join(root, f)
        files.append((os.path.relpath(lp, SRC).replace('\\', '/'), lp))
files.sort()

tree = []
for rel, lp in files:
    data = open(lp, 'rb').read()
    s, d = api('/repos/%s/%s/git/blobs' % (OWNER, REPO), 'POST',
               {'content': base64.b64encode(data).decode('ascii'), 'encoding': 'base64'})
    if s != 201:
        sys.exit('BLOB FAIL %s %s %s' % (rel, s, d))
    tree.append({'path': rel, 'mode': '100644', 'type': 'blob', 'sha': d['sha']})
    print('  blob', rel, len(data))

s, d = api('/repos/%s/%s/git/trees' % (OWNER, REPO), 'POST', {'base_tree': base_tree, 'tree': tree})
if s != 201:
    sys.exit('TREE FAIL %s %s' % (s, d))
tree_sha = d['sha']
print('NEW_TREE', tree_sha, 'entries', len(d.get('tree', [])))

msg = ('启用 GitHub Pages 站点：新增 _config.yml（minima 主题）、首页文章卡片、样式表\n\n'
       '索引链接改为 .html 以匹配 Jekyll 输出路径；文章页加返回索引；'
       'email-2fa 正文含 Liquid 语法，已用 raw 包裹。')
s, d = api('/repos/%s/%s/git/commits' % (OWNER, REPO), 'POST',
           {'message': msg, 'tree': tree_sha, 'parents': [head]})
if s != 201:
    sys.exit('COMMIT FAIL %s %s' % (s, d))
c = d['sha']
print('COMMIT', c)

s, d = api('/repos/%s/%s/git/refs/heads/%s' % (OWNER, REPO, BRANCH), 'PATCH', {'sha': c, 'force': True})
print('REF', s, d.get('ref') if s == 200 else d)
print('DONE', c)
