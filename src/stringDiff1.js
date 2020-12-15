export const stringDiff = (a, b, e) => {
  console.log('a, b', a, ',', b, 'e', e)
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
      const strMatch1 = [...a.matchAll(a[i])]
      const strMatch2 = [...b.matchAll(b[j])]
      if (
        strMatch1.length !== strMatch2.length ||
        e.includes(strMatch2[0][0])
      ) {
        // this seems to work even though it's just counting the number of matches
        console.log('strMatch2', strMatch2[0][0])

        end1 = true
        end2 = true
        match = false
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
    results.push(b)
  }

  return { match, results, error }
}

// originally from https://github.com/Lin-H/comparer - some changes made
