// export const note = [
//   {
//     name: 'AAA',
//     collapsed: false,
//     level: 0,
//     id: '0',
//     _children: [],
//     children: [
//       { id: '0-0', name: 'AAACCC', level: 1, collaped: false, _children: [], children: [] },
//       { id: '0-1', name: 'AAADDD', level: 1, collaped: true, children: [], _children: [{ id: '0-1-0', name: '这是中文这是中文这是中文这是中文这是中文这是中文这是中文', level: 2, collaped: false, _children: [], children: [] }] },
//       { id: '0-2', name: '这是中文这是中文', level: 1, collaped: false, _children: [], children: [] }
//     ]
//   },
//   {
//     name: 'AAA',
//     collapsed: true,
//     level: 0,
//     id: '1',
//     children: [],
//     _children: [
//       { id: '1-0', name: 'AAACCC', level: 1, collaped: false, _children: [], children: [] },
//       { id: '1-1', name: 'AAADDD', level: 1, collaped: false, _children: [], children: [{ id: '1-1-0', name: '这是中文这是中文这是中文这是中文这是中文这是中文这是中文', level: 2, collaped: false, _children: [], children: [] }] },
//       { id: '1-2', name: '这是中文这是中文', level: 1, collaped: false, _children: [], children: [] }
//     ]
//   }
// ]
export const note = [
  {
    name: 'AAA',
    collapsed: false,
    show: true,
    level: 0,
    id: '0',
    pid: '-1',
    _children: [],
    children: [
      { id: '0-0', pid: '0', show: false, name: 'AAACCC', level: 1, collaped: false, _children: [], children: [] },
      { id: '0-1', pid: '0', show: false, name: 'AAADDD', level: 1, collaped: true, _children: [], children: [{ pid: '0-1', show: false, id: '0-1-0', name: '这是中文这是中文这是中文这是中文这是中文这是中文这是中文', level: 2, collaped: false, _children: [], children: [] }] },
      { id: '0-2', pid: '0', show: false, name: '这是中文这是中文', level: 1, collaped: false, _children: [], children: [] }
    ]
  }
]
const data = {
  name: '这是一个标题{title}',
  content: []
}
const flattendList = []
const iter = list => {
  if (!list || !list.length) return
  for (const v of list) {
    flattendList.push(v)
    iter(v.children)
  }
}
iter(note)
data.content = flattendList
console.log(data)
export default data
