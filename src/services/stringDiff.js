export const stringDiff = (a, b) => {
  let match = false,
    error = ''
  const results = []

  for (const i in b) {
    const strMatch1 = [...a.matchAll(a[i])]
    const strMatch2 = [...b.matchAll(b[i])]
    let n = parseInt(i)

    if (strMatch1.length !== strMatch2.length) {
      match = false
      n = b.length
      return { results }
    } else if (strMatch1.length === strMatch2.length && b.length === n + 1) {
      match = true
    }
    if (match === true) {
      results.push({ word: b })
    }
  }

  return { match, results, error }
}

// originally from https://github.com/Lin-H/comparer - some changes made
