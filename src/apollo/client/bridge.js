import { createApolloClient } from './index'

const rinkebyClient = createApolloClient(`https://api.thegraph.com/subgraphs/name/${getSubgraphName(4)}`)
const mumbaiClient = createApolloClient(`https://api.thegraph.com/subgraphs/name/${getSubgraphName(80001)}`)

export function getApolloClient(chainId) {
  switch (Number(chainId)) {
    case 4:
      return rinkebyClient
    case 80001:
      return mumbaiClient
    default:
      console.error(`${chainId} is not supported by apollo clients`)
      return null
  }
}

export function getSubgraphName(chainId) {
  switch (Number(chainId)) {
    case 4:
      return 'portalspace/erc721bridge-rinkeby'
    case 80001:
      return 'portalspace/erc721bridge-mumbai'
    default:
      console.error(`${chainId} is not supported by apollo clients`)
      return null
  }
}
