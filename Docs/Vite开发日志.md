# 2026/9/12

## 进度
- 如何打开网站:在aero-salvager-react工作目录下,控制台输入**npm run dev**,在本地运行
- 实现了坐标相关的工具函数,放在utils文件夹下
- 在App.tsx中成功渲染了二维网格以及相关逻辑

## 相关语法

- `export`:外部函数关键字
- TypeScript函数的原型
- Lambda函数
- 关于`return`:Ts中可省略';', 换行时自动结束,如果需要写入多行,使用()包含全部内容
- `let`:给变量赋值
- `.some()`和`.filter()`的使用
- `app()`函数在return之前可声明变量,<div>块按行排版,<span>按列排版
- JSX中使用Js对象要用{},Js对象本身也用{},有时会出现{{}}
- `style`修改标签风格，`onClick`添加标签点击逻辑

# 2026/9/13

## 进度

- 将C++求解代码移植到了TypeScript
- 使用worker实现了app与后端的通信，使得计算能够异步进行
- 添加了按钮UI以及相关逻辑

# 2026/9/14

## 进度

- 成功将worker的计算结果在网页网格中正确渲染
- 使用了style字段verticalAlign:'top'修复了渲染后网格不对齐的bug
- 在显示result时，修改N会出现未重置的bug(已修复)