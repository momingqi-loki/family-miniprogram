# TDesign 组件库使用指南

## 安装（已完成）

组件库已安装在 `miniprogram/node_modules/tdesign-miniprogram`

## 微信开发者工具中构建

1. 打开微信开发者工具
2. 导入 `family-miniprogram/miniprogram` 项目
3. 点击菜单：**工具 → 构建 npm**
4. 勾选 **"使用 npm 模块"**

## 常用组件使用

### Button 按钮

```json
// page.json
{
  "usingComponents": {
    "t-button": "tdesign-miniprogram/button/button"
  }
}
```

```xml
<!-- wxml -->
<t-button theme="primary" size="large" block>主按钮</t-button>
<t-button theme="outline" size="large" block>次要按钮</t-button>
<t-button theme="text" size="large" block>文字按钮</t-button>
```

### Card 卡片

```json
{
  "usingComponents": {
    "t-card": "tdesign-miniprogram/card/card"
  }
}
```

```xml
<t-card title="卡片标题" bordered>
  这是卡片内容
</t-card>
```

### 导入所有组件

在 `app.json` 中全局引入：

```json
{
  "usingComponents": {
    "t-button": "tdesign-miniprogram/button/button",
    "t-cell": "tdesign-miniprogram/cell/cell",
    "t-cell-group": "tdesign-miniprogram/cell-group/cell-group",
    "t-icon": "tdesign-miniprogram/icon/icon",
    "t-toast": "tdesign-miniprogram/toast/toast",
    "t-dialog": "tdesign-miniprogram/dialog/dialog",
    "t-tabs": "tdesign-miniprogram/tabs/tabs",
    "t-tab-panel": "tdesign-miniprogram/tab-panel/tab-panel",
    "t-input": "tdesign-miniprogram/input/input",
    "t-switch": "tdesign-miniprogram/switch/switch",
    "t-tag": "tdesign-miniprogram/tag/tag",
    "t-avatar": "tdesign-miniprogram/avatar/avatar",
    "t-empty": "tdesign-miniprogram/empty/empty",
    "t-loading": "tdesign-miniprogram/loading/loading"
  }
}
```

## 主题定制

TDesign 支持主题变量覆盖，可在 `app.wxss` 中修改：

```css
page {
  --td-brand-color: #FF8C00;        /* 主色 */
  --td-brand-color-light: #FFF3E0;   /* 主色浅色 */
  --td-success-color: #4CAF50;      /* 成功色 */
  --td-warning-color: #FFC107;      /* 警告色 */
  --td-error-color: #FF5252;        /* 错误色 */
}
```

## 组件示例

详见：https://github.com/Tencent/tdesign-miniprogram
