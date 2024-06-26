# Quick-Man 飞侠💨

本项目是基于 `vite` 工具和 `antd` 构建的前端页面，用于简化 **振动频率/力常数 -> 同位素分馏** 的计算过程，实现 **批量化，工程化** 的计算流水线。

## 支持功能

- ✅ 目前仅支持 `CASTEP` 和 `GAUSSIAN` 两个软件的输出文件格式，后续会补充 `VASP` 的功能。

- ✅ 支持 **频率数据 -> 同位素分馏/力常数** 的计算服务，并且支持 **在线查看/导出-计算数据和图片**。

- ✅ 项目目前为纯前端应用，数据存储在 `localStorage` 中，后续会基于 `Node.js` 和 `nest.js` 开发对应的后端服务。并同步更新 app 端服务，开发时间待定...⌛️

## 后续可能的更新迭代点

- 🧚 基于 `WebGL` 实现三维可视化预览矿物晶体结构，并支持交互操作。
- 🧚 接入 `分子动力学（MM）` 计算服务，实现 **分子模拟**、**Onion-model** 计算。
- 🧚 接入 **超算 Linux 服务器**，直接支持在页面配置计算脚本并拉取计算结果，实现全流程自动化。
- 🧚 配置 **用户登陆中心**，实现 `SSO` 和 **多端协调**，**隔离用户权限** 和 **确保数据安全**。
- 🧚 接入 **微信公众号** 等消息通知第三方服务，实时推送 *工作流状态* 消息。
- 🧚 接入 `富文本` 编辑功能，支持线上记录文档并进行分享。
- 🧚 支持好友聊天功能，对标 `QQ`、`Wechat` 等在线聊天工具。
- 🧚 实现 **系统**、**全面** 的工作提效应用 `APP`，实现多端服务统一。
- 🧚 ...