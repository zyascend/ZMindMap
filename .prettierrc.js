module.exports = {
  // 代码结尾是否加分号
  semi: false,
  // 是否使用单引号
  singleQuote: true,
  // 对象大括号内两边是否加空格 { a:0 }
  bracketSpacing: true,
  // 单个参数的箭头函数不加括号 x => x
  arrowParens: 'avoid',
  // 超过多少字符强制换行
  printWidth: 80,
  // 文件换行格式 LF/CRLF
  endOfLine: 'lf',
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: 'none',
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css'
}
