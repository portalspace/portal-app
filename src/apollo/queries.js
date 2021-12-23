import gql from 'graphql-tag'

export const ENTRIES = gql`
  query entries($account: Bytes!) {
    entries(
      where: { account: $account },
      orderBy: timestamp,
      orderDirection: desc,
    ) {
      id
      txId
      tokenId
      nftId
      fromChain
      toChain
      account
      block
      timestamp
      deposited
      claimed
      contractAddress
      mainChain
      isMuon
      isMain
      name
      symbol
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const BALANCES = gql`
  query tokens($account: Bytes!) {
    tokens(
      where: { owner: $account }
    ) {
      registry {
        id
        supportsMetadata
        name
        symbol
      }
      identifier
      uri
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const TOKENS = gql`
  query tokens {
    tokens {
      id
      contractAddress
      mainChain
      tokenId
      isMuon
      isMain
      name
      symbol
    }
    _meta {
      block {
        number
      }
    }
  }
`

export const SUBGRAPH_HEALTH = gql`
  query health($subgraphName: String!) {
    indexingStatusForCurrentVersion(
      subgraphName: $subgraphName,
    ) {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`
