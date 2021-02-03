export const stringDiff = (a, b, c) => {
  const reducer1 = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
    (regXString, placeholder) =>
      regXString.replace(RegExp(placeholder, ''), `([^${c}])`),
    String(a)
  )

  const replacer1 = reducer1.replace(/([1-9])/g, '\\$1')
  const replacer2 = replacer1.replace(/\?/g, `[^${c}]`)
  const regXWord = RegExp(replacer2, '')
  const results = b
    .filter((item) => regXWord.test(item.word))
    .map((item) => {
      const word = item.word.match(regXWord)
      return { word: word[0] }
    })
  if (results.length === 0) {
    return [{ word: 'Nothing matches the pattern.' }]
  }
  return results
}
//https://stackoverflow.com/questions/65514498/filter-array-of-strings-based-on-a-pattern-with-placeholders
