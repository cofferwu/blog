---
title: 技术博客
layout: default
---

<p class="site-intro">共 12 篇文章 · 由 OneNote 笔记整理，WorkBuddy AI 编排优化</p>

<ul class="post-list">
<li class="post-card">
  <a class="post-link" href="authentik-dingding.html">Authentik 接入钉钉</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-11-11</time></div>
  <p class="post-excerpt">为 Authentik 添加钉钉作为第三方登录源（OAuth Source），用户可直接使用钉钉扫码/账号登录。由于钉钉开放平台已提供标准的 OAuth 应用模板，整个过程通过…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-wechat-work.html">Authentik 企业微信登录</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-11-10</time></div>
  <p class="post-excerpt">为 Authentik 添加企业微信作为登录源，并解决一个关键问题：企业微信通讯录 API 只能拿到 `userid`，用户的邮箱字段需要在用户完成 OAuth 授权后才能获取…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-forward-auth.html">Authentik Forward Auth 反向代理认证</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-11-04</time></div>
  <p class="post-excerpt">本文记录用 Nginx 的 `auth_request` 模块对接 authentik outpost，为单个后端应用（示例为 IIS 站点 `app.zjtdemo.clou…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-nginx.html">Authentik + Nginx 流量架构</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-11-04</time></div>
  <p class="post-excerpt">本文梳理 authentik 部署中各类流量的走向：HTTPS 认证流量、应用流量、auth_request 鉴权子请求、LDAP 流量以及 Docker 内网回连。明确端口与…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-upgrade.html">Authentik 升级与备份</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-11-04</time></div>
  <p class="post-excerpt">authentik 升级前必须先备份数据库与配置，因为升级会带来不可逆的数据库 schema 迁移，且官方**不支持降级**。本文记录一次从旧版本升级到 2026.8.5 的完…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-ldap-outpost.html">Authentik LDAP outpost</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-10-28</time></div>
  <p class="post-excerpt">Authentik 的 LDAP outpost 可以把 Web 侧的用户目录以标准 LDAP / LDAPS 协议暴露给 Linux 主机，让 sssd 等传统 PAM 组件…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-custom-footer.html">Authentik 自定义页脚品牌</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-10-26</time></div>
  <p class="post-excerpt">authentik 登录页底部默认会显示一组站点链接（Help、Terms 等）。如果这些链接对内部系统没有意义，可以通过创建 Brand（品牌）并注入自定义 CSS，把它们替…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-email-2fa.html">Authentik 邮箱双因素认证</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-10-26</time></div>
  <p class="post-excerpt">本文记录为 authentik 配置邮箱验证码作为第二因素（Email MFA）的完整流程：SMTP 配置 → 创建邮件验证器 Stage → 在 MFA 验证阶段启用 Ema…</p>
</li>
<li class="post-card">
  <a class="post-link" href="authentik-feishu-sso.html">Authentik 飞书 SSO 配置</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-10-26</time></div>
  <p class="post-excerpt">本文记录用 authentik 对接飞书实现 SSO 登录的配置。飞书不提供标准的 OIDC discovery 端点，需要用 OAuth（Generic）方式手工填写授权、令…</p>
</li>
<li class="post-card">
  <a class="post-link" href="ningdun-netscaler-saml-sso.html">宁盾与 NetScaler SAML SSO 对接</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-10-16</time></div>
  <p class="post-excerpt">本文记录以宁盾作为 SAML IdP、Citrix NetScaler（ADC）作为 SP 的 SSO 对接过程。重点是从宁盾自动生成的 IdP metadata 中提取并正确…</p>
</li>
<li class="post-card">
  <a class="post-link" href="ningdun-http-sms.html">宁盾 HTTP 短信通道配置</a>
  <div class="post-meta"><span class="badge">身份与认证</span> <time>2026-07-06</time></div>
  <p class="post-excerpt">宁盾可通过 HTTP 接口对接外部短信网关。本文在 Rocky Linux 上用 Flask 搭建一个轻量级的短信接收服务：无论宁盾以 JSON POST、表单 POST 还是…</p>
</li>
<li class="post-card">
  <a class="post-link" href="dell-wyse-citrix-tuning.html">Dell Wyse 瘦客户端 Citrix 优化</a>
  <div class="post-meta"><span class="badge">桌面虚拟化</span> <time>2021-12-02</time></div>
  <p class="post-excerpt">Dell Wyse 瘦客户端在使用 Citrix Receiver / Desktop Viewer 时，默认会弹出商店配置框、加载项提示、锁定桌面等，影响自助终端或公用桌面的…</p>
</li>
</ul>
