export const note = [
  {
    name: 'AAA',
    collapsed: false,
    level: 0,
    id: '0',
    pId: '-1',
    _children: [],
    children: [
      { pId: '0', id: '0-0', name: 'AAACCC', level: 1, collaped: false, _children: [], children: [] },
      { pId: '0', id: '0-1', name: 'AAADDD', level: 1, collaped: true, children: [], _children: [{ pId: '0-1', id: '0-1-0', name: '这是中文这是中文这是中文这是中文这是中文这是中文这是中文', level: 2, collaped: false, _children: [], children: [] }] },
      { pId: '0', id: '0-2', name: '这是中文这是中文', level: 1, collaped: false, _children: [], children: [] }
    ]
  },
  {
    name: 'AAA',
    collapsed: true,
    level: 0,
    id: '1',
    pId: '-1',
    children: [],
    _children: [
      { pId: '1', id: '1-0', name: 'AAACCC', level: 1, collaped: false, _children: [], children: [] },
      { pId: '1', id: '1-1', name: 'AAADDD', level: 1, collaped: false, _children: [], children: [{ pId: '1-1', id: '1-1-0', name: '这是中文这是中文这是中文这是中文这是中文这是中文这是中文', level: 2, collaped: false, _children: [], children: [] }] },
      { pId: '1', id: '1-2', name: '这是中文这是中文', level: 1, collaped: false, _children: [], children: [] }
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
export default data
