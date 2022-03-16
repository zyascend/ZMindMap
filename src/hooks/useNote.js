export const flatter = data => {
  const flatedList = []
  const iter = list => {
    if (!list || !list.length) return
    for (const v of list) {
      flatedList.push(v)
      iter(v.children)
    }
  }
  iter(data)
  return flatedList
}
