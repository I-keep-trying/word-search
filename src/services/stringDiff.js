export const stringDiff = (a, b) => {
  let i = 0,
    j = 0,
    len1 = a.length,
    len2 = b.length,
    end1 = false,
    end2 = false,
    match = false,
    error = ''
  const results = []

  while (true) {
    if (a.length !== b.length) {
      end1 = true
      end2 = true
      match = false
      console.log('params must be equal length')
      error = 'params must be equal length'
    }
    if (end1 && end2) break
    if (a[i] === b[j] && !end1 && !end2) {
      end1 = i + 1 === len1
      end2 = j + 1 === len2
      end1 || i++
      end2 || j++
      continue
    }

    if (a[i] !== b[j] && !end1 && !end2) {
      console.log('a', a, 'b', b)

      const strMatch1 = [...a.matchAll(a[i])]
      const strMatch2 = [...b.matchAll(b[j])]
      if (strMatch1.length !== strMatch2.length) {
        end1 = true
        end2 = true
        match = false
        break
      } else {
        end1 = i + 1 === len1
        end2 = j + 1 === len2
        end1 || i++
        end2 || j++
        match = true
        continue
      }
    }
  }

  if (match === true) {
    results.push({ word: b })
  }
  return { match, results, error }
}

// originally from https://github.com/Lin-H/comparer - some changes made
