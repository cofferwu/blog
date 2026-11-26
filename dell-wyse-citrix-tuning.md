---
title: "Dell Wyse 瘦客户端 Citrix 优化"
date: 2021-12-02 04:06:38 +00:00
categories:
  - 桌面虚拟化
tags:
  - Citrix
  - Wyse
  - 瘦客户端
  - 注册表
---

## 概述

Dell Wyse 瘦客户端在使用 Citrix Receiver / Desktop Viewer 时，默认会弹出商店配置框、加载项提示、锁定桌面等，影响自助终端或公用桌面的使用体验。本文用一组批处理命令做统一优化，并给出通过注册表加载方式禁用 `Win+L` 锁屏的 PowerShell 脚本。

> 以下命令会修改系统注册表和用户配置，建议先在单台设备上测试，确认无误后再批量推送。

## 一、批处理优化脚本

保存为 `.bat` 后以管理员权限执行：

```bat
@echo off

REM 不弹出 Receiver 配置框
REG ADD "HKLM\SOFTWARE\WOW6432Node\Citrix\Dazzle" /v AllowAddStore /t REG_SZ /d "N" /f

REM 桌面强制全屏
REG ADD "HKLM\SOFTWARE\WOW6432Node\Citrix\XenDesktop\DesktopViewer" /v ForceFullScreen /t REG_DWORD /d 1 /f

REM 添加信任站点（按实际域名调整）
REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains\jiuzhoupharma.com.cn\cloud" /v https /t REG_DWORD /d 2 /f

REM 取消 IE 加载项启用提示
REG ADD "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Ext" /v IgnoreFrameApprovalCheck /t REG_DWORD /d 1 /f

REM 取消 IE 加载项性能影响提示
REG ADD "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Ext" /v DisableAddonLoadTimePerformanceNotifications /t REG_DWORD /d 1 /f

REM 取消睡眠模式（AC 供电时）
REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Power\PowerSettings\0e796bdb-100d-47d6-a2d5-f7d2daa51f51" /v ACSettingIndex /t REG_DWORD /d 0 /f

REM 清除 user 账户密码并允许修改
net user user "" /passwordchg:yes

exit
```

各项作用说明：

| 注册表项 | 作用 |
| --- | --- |
| `AllowAddStore = N` | 阻止 Receiver 首次运行时弹出应用商店配置向导 |
| `ForceFullScreen = 1` | 发布桌面强制全屏显示，隐藏本地任务栏 |
| `ZoneMap\Domains\...\https = 2` | 把指定站点加入 IE 受信任区域（`2` = Trusted Zone） |
| `IgnoreFrameApprovalCheck = 1` | 抑制「是否允许加载项运行」的确认提示 |
| `DisableAddonLoadTimePerformanceNotifications = 1` | 抑制加载项拖慢速度的提示气泡 |
| `ACSettingIndex = 0` | 接通电源时不进入睡眠，避免远程桌面掉线 |

> `net user user ""` 会清空 `user` 账户密码，仅适用于专用瘦客户端场景；通用办公环境请勿使用。

## 二、禁用 Win+L 锁定桌面

由于 `reg load` 命令无法通过 WMS（Wyse Management Suite）直接推送，改用 PowerShell 脚本加载目标用户的注册表配置单元后再写入：

```powershell
# 卸载已挂载的配置单元（如存在）
& reg unload HKU\ZZZ 2>$null

# 加载 user 用户的 NTUSER.DAT
& reg load HKU\ZZZ C:\Users\User\NTUSER.DAT

# 禁用 Win+L 锁定工作站
& reg add HKU\ZZZ\Software\Microsoft\Windows\CurrentVersion\Policies\System `
  /v DisableLockWorkstation /t REG_DWORD /d 1 /f

# 卸载配置单元，写回磁盘
& reg unload HKU\ZZZ
```

要点：

- `HKU\ZZZ` 是临时挂载点，名称可自定义，但 `reg load` 与 `reg unload` 必须成对出现。
- 执行时需要管理员权限，且目标用户不能处于登录状态，否则 `NTUSER.DAT` 会被占用。
- 修改后需用户重新登录才生效。

## 三、回滚方式

如需恢复默认值，删除对应注册表项即可，例如：

```bat
REG DELETE "HKLM\SOFTWARE\WOW6432Node\Citrix\Dazzle" /v AllowAddStore /f
```

禁用锁屏的回滚：

```powershell
& reg load HKU\ZZZ C:\Users\User\NTUSER.DAT
& reg delete HKU\ZZZ\Software\Microsoft\Windows\CurrentVersion\Policies\System /v DisableLockWorkstation /f
& reg unload HKU\ZZZ
```

---

> 本文由 WorkBuddy AI 编辑整理。
