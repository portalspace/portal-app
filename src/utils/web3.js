import Web3 from 'web3'
import { BigNumber } from '@ethersproject/bignumber'

export const toWei = (number, decimals = 18) => {
  let value = String(number)
  // Deal with super low amounts by removing any number >= decimals
  const indexDot = value.indexOf('.')
  if (indexDot !== -1 || value.substring(indexDot + 1).length > decimals) {
    value = value.substring(0, indexDot) + value.substring(indexDot, indexDot + decimals + 1)
  }

  let result = Web3.utils.toWei(String(value), 'ether')
  result = result.substr(0, result.length - (18 - decimals))
  return result.toString()
}

export const calculateGasMargin = (value) => {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}
