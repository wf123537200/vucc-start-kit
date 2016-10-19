## 脚手架说明

  基于vue.js的webapp脚手架, 默认安装vue，vue-route，vue-resource
  样式集成sass/compass

  项目基于eslint, es2015


### 目录结构
  开始之前，请先预览一下项目的目录结构

  ```
  .
  ├── README.md
  ├── dist                          // 项目build结果目录
  ├── components                    // 公用组件目录
  ├── libraries                     // 第三方库目录
  ├── assets                        // 资源目录,存放相关资源,可以使用compass自动精灵图功能
  ├── index.html                    // 项目入口文件,用于测试
  ├── service                       // 项目公用服务入口
  ├── assets                        // 重构输出的css和图片资源
  ├── views                         // 项目页面
  │   └── module                    // 模块名
  │        │── config.json          // npm run create-comjs命令会将此文件中配置的文件打包生成 dist/module/common.js, 此文件路由时会自动加载
  │        │── index.vue            // 入口的vue模块,会作为module的入口模块被使用
  │        │── style.scss           // 模块样式
  │        └── page-component.vue   // 页面的其他模块,现放置组件库demo
  ├── package.json                  // 项目配置文件,已经集成vucc
  ├── gulpfile.js                   // gulp配置文件
  └── webpack.config.js             // Webpack 配置文件
  ```

### 快速开始


#### 安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```

#### 3.打包common.js
```
npm run common.js
```

#### 4.启动服务(http://localhost:8080)

```
npm run dev
```


#### 5.发布代码
```
npm run prd
```
