var a = 'asdfy'
var b = `{adffy;lkjhg`

function C(a, b) {
  if (a == b) return ''
  if (!a && b) {
    return console.log(`增加：${b}`)
  }
  if (a && !b) {
    return console.log(`删除：${a}`)
  }
  var i = 0,
    j = 0,
    len1 = a.length,
    len2 = b.length,
    index1 = 0,
    index2 = 0,
    end1 = false,
    end2 = false
  var diff1 = [],
    diff2 = []
  while (true) {
    if (end1 && end2) break
    if (a[i] == b[j] && !end1 && !end2) {
      end1 = i + 1 == len1
      end2 = j + 1 == len2
      end1 || i++
      end2 || j++
      continue
    }
    if (!diff1.length && !diff2.length) {
      index1 = i
      index2 = j
    }
    end1 || diff1.push(a[i])
    end2 || diff2.push(b[j])
    if (diff1[0] == diff2[diff2.length - 1]) {
      // addition
      console.log(`增加：${diff2.slice(0, -1)}`)
      diff1 = []
      diff2 = []
      i = index1
    } else if (diff2[0] == diff1[diff1.length - 1]) {
      // deletion
      console.log(`删除：${diff1.slice(0, -1)}`)
      diff1 = []
      diff2 = []
      j = index2
    }
    end1 = i + 1 == len1
    end2 = j + 1 == len2
    end1 || i++
    end2 || j++
  }
  if (diff1.length) {
    console.log(`删除：${diff1}`)
  }
  if (diff2.length) {
    console.log(`增加：${diff2}`)
  }
}
//C(a, b)

// originally from https://github.com/Lin-H/comparer - some changes made
