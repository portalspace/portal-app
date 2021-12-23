export const stringifyParams = (params) => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&')
}

export const isValidHttpUrl = (string) => {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const getHostFromUrl = (str) => {
  try {
    const url = new URL(str)
    return url.host
  } catch (err) {
    console.log(str)
    console.error(err)
    return null
  }
}
