export const parseBase64 = (input) => {
  try {
    input = input.replace('data:application/json;base64,', '')
    let base64ToString = Buffer.from(input, 'base64').toString()
    return JSON.parse(base64ToString)
  } catch (err) {
    console.error(err)
    return null
  }
}
