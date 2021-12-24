import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'

import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'
import { useWeb3React } from '../../../../hooks/useWeb3'
import { ClaimState, useClaimCallback } from '../../../../hooks/useClaim'
import { useClaims } from '../../../../state/entries/hooks'

import { AutoRow } from '../../../Row'
import { PrimaryButton } from '../../../Button'
import { Image } from '../Image'
import { Loader } from '../../../Icons'
import { Card } from '../../../Card'
import { SectionTitle } from '../../../Title'

const Container = styled(Card)`
  margin-top: 17px;
  min-height: 50px;
  max-height: 300px;
  overflow-y: scroll;
  width: 100%;
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 20px;
  gap: 13px;
`

const Row = styled(AutoRow)`
  justify-content: flex-end;
  & > * {
    &:first-child {
      margin-right: 10px;
    }
  }
`

const Name = styled.div`
  margin-right: auto;
  text-overflow: ellipsis;
  font-size: 15px;
  max-width: 150px;
`

const SourceWrapper = styled.div`
  justify-content: center;
  margin: 0 auto;
`

const Source = styled(AutoRow)`
  justify-content: flex-start;
  font-size: 10px;
  line-height: 12px;

  & > * {
    &:first-child {
      color: rgba(239, 239, 239, 0.5);
    }
  }
`

const EmptyWrapper = styled(AutoRow)`
  justify-content: center;
  margin: auto 0;
  font-size: 13px;
`

export const Claims = () => {
  const { chainId } = useWeb3React()
  const { data: claims, status: claimsStatus } = useClaims()
  const [selectedNftId, setSelectedNftId] = useState(null)
  const [selectedTokenId, setSelectedTokenId] = useState(null)
  const [claimState, claimCallback] = useClaimCallback(selectedTokenId, selectedNftId)

  const [isLoading, isError] = useMemo(() => {
    return [
      claimsStatus == 'LOADING',
      claimsStatus == 'ERROR',
    ]
  }, [claimsStatus])

  return (
    <>
      <SectionTitle>Claimable NFTs {isLoading && <Loader size='12px' style={{marginLeft: '5px'}}/>}</SectionTitle>
      <Container>
        {(isLoading && !claims.length) ? (
          <EmptyWrapper>
            <Loader size='25px'/>
          </EmptyWrapper>
        ) : !claims.length ? (
          <EmptyWrapper>You don't have any crosschain NFTs to claim, yet.</EmptyWrapper>
        ) : (
          <Wrapper>
              {claims.map((entry, index) => {
                const { contractAddress, nftId, isMuon, fromChain, toChain, tokenId, name, symbol, txId, mainChain } = entry
                return (
                  <Row key={index}>
                    <Image
                      contractAddress={contractAddress}
                      isMuon={isMuon}
                      nftId={nftId}
                      alt={`${nftId} image`}
                      size={'30px'}
                    />
                    <Name>#{nftId} {name}</Name>
                    <SourceWrapper>
                      <Source>
                        <div>Original:&nbsp;</div>
                        <div>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[mainChain]}</div>
                      </Source>
                      <Source>
                        <div>From:&nbsp;</div>
                        <div>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[fromChain]}</div>
                      </Source>
                    </SourceWrapper>

                    {(claimState === ClaimState.LOADING && selectedNftId === nftId) ? (
                      <PrimaryButton active={true}>Fetching signatures..</PrimaryButton>
                    ) : (claimState === ClaimState.PENDING && selectedNftId === nftId) ? (
                      <PrimaryButton active={true}>Claiming...</PrimaryButton>
                    ) : (
                      <PrimaryButton onClick={() => {
                        setSelectedNftId(nftId)
                        setSelectedTokenId(tokenId)
                        claimCallback({
                          contractAddress,
                          nftId,
                          fromChain,
                          toChain,
                          tokenId,
                          txId,
                          name,
                          symbol,
                          isMuon,
                        })
                      }}>Claim</PrimaryButton>
                    )}
                  </Row>
                )
              })}
          </Wrapper>
        )}
      </Container>
    </>
  )
}
