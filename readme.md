# One-API 模型定价倍率计算器

这是一个用于计算 One-API 模型定价倍率的工具。它支持在 1K 和 1M tokens 之间切换，并计算模型倍率和补全倍率。

在线使用：[onecalc.atlassc.net](https://onecalc.atlassc.net)

## 功能

- **模型倍率计算**：根据输入和输出价格计算模型倍率。
- **补全倍率计算**：计算输出价格相对于输入价格的倍率。
- **单位切换**：支持在每 1K 和 1M tokens 之间切换价格计算。
- **数据持久化**：使用浏览器的 localStorage 存储数据。

## 使用方法

1. 克隆仓库：
   ```bash
   git clone https://github.com/ShinChven/one-api-multiplier-calculator.git
   ```

2. 进入项目目录：
   ```bash
   cd one-api-multiplier-calculator/app
   ```

3. 安装依赖：
   ```bash
   npm install
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 在浏览器中访问 `http://localhost:5173` 查看应用。

## 贡献

欢迎提交问题和请求。请确保在提交之前阅读我们的贡献指南。

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE 文件](./LICENSE)。

## 联系

如有任何问题，请通过 GitHub 提交 issue。

[GitHub 仓库](https://github.com/ShinChven/one-api-multiplier-calculator)