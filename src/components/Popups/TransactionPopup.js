import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { X } from 'react-feather'
import styled, { keyframes } from 'styled-components'

import { useRpcChangerCallback } from '../../hooks/useRpcChangerCallback'
import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../constants/network'

import { Image } from '../App/NFT/Image'
import { ExplorerDataType, ExplorerLink } from '../Link'
import { CheckMark, Copy as CopyIcon, Loader } from '../Icons'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 14px 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: #919191;
`

const Close = styled(X)`
  width: 15px;
  height: 15px;
  color: #919191;
  &:hover {
    cursor: pointer;
  }
`

const InfoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin-top: 15px;
  margin-bottom: 25px;

  & > * {
    &:nth-child(2) {
      display: flex;
      flex-flow: column nowrap;
      & > * {
        &:first-child {
          font-size: 12.5px;
        }
        &:nth-child(2) {
          font-size: 20px;
        }
        &:nth-child(3) {
          font-size: 15px;
          color: #6F7077;
        }
      }
    }
  }
`

const SuccessBox = styled(ExplorerLink)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
  background: #293241;
  border: 0.5px solid #00E376;
  border-radius: 10px;
  height: 35px;
  padding: 10px;
  text-decoration: none;

  & > * {
    font-size: 12.5px;
    line-height: 35px;
    &:first-child {
      margin-right: 8px;
    }
    &:last-child {
      margin-left: auto;
    }
  }
`

const BottomRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-top: 16px;
  justify-content: space-between;
  align-items: center;

  & > * {
    font-size: 12.5px;
    align-items: center;
  }
`

const SwitchButton = styled.button`
  position: relative;
  width: 100px;
  background: #3B475B;
  border-radius: 5px;
  font-size: 10px;
  align-items: center;
  text-align: center;
  padding: 4px 10px;
  transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s; /* Safari */
  font-size: 12.5px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    border-radius: 1em;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.5s;
    box-shadow: 0 0 2px 2px white;
  }

  &:active:after {
    box-shadow: 0 0 0 0 white;
    position: absolute;
    border-radius: 1em;
    left: 0;
    top: 0;
    opacity: 1;
    transition: 0s;
  }

  &:active {
    top: 1px;
  }
`

export default function TransactionPopup({ content, removeThisPopup }) {
  const dispatch = useDispatch()
  const { hash, success, summary: { method, contractAddress, fromChain, toChain, nftId, name, symbol, isMuon } } = content
  const rpcChanger = useRpcChangerCallback()

  const [showAdvanced, showTargetChainSwitch] = useMemo(() => {
    return [
      method === 'Claim' || method === 'Deposit',
      method === 'Deposit',
    ]
  }, [method])

  const getHeader = () => {
    return (
      <Header>
        {method}
        <Close onClick={removeThisPopup} />
      </Header>
    )
  }

  const getBox = () => {
    <SuccessBox
      type={ExplorerDataType.TX}
      chainId={fromChain}
      value={hash}
      color={success ? '#00E376' : 'red'}
    >
      <CheckMark color={success ? '#00E376' : 'red'} />
      <div>Transaction {success ? 'successful' : 'failed'}</div>
      <CopyIcon />
    </SuccessBox>
  }

  if (showAdvanced) {
    return (
      <Wrapper>
        {getHeader()}
        <InfoWrapper>
          <Image
            contractAddress={contractAddress}
            isMuon={isMuon}
            nftId={nftId}
            alt={`${nftId} image`}
            height={'90px'}
            style={{justifyContent: 'flex-start'}}
          />
          <div>
            <div>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[fromChain]} to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[toChain]}</div>
            <div>{symbol} #{nftId}</div>
            <div>{name}</div>
          </div>
        </InfoWrapper>
        {getBox()}
        <BottomRow>
          <div>
            It may take up to 30 seconds for your balances to update.
          </div>
          {showTargetChainSwitch && (
            <SwitchButton onClick={() => rpcChanger(toChain)}>Switch to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[toChain]}</SwitchButton>
          )}
        </BottomRow>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {getHeader()}
      {getBox()}
    </Wrapper>
  )
}
