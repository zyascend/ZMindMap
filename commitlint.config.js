// git commit 规范
// <类型>[可选的作用域]: <描述>

// # 主要type
// feat:     增加新功能
// fix:      修复bug

// # 特殊type
// docs:     只改动了文档相关的内容
// style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
// build:    构造工具的或者外部依赖的改动，例如webpack，npm
// refactor: 代码重构时使用
// revert:   执行git revert打印的message

// # 暂不使用type
// test:     添加测试或者修改现有测试
// perf:     提高性能的改动
// ci:       与CI（持续集成服务）有关的改动
// chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
};
