import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { ApprovalState, useApproveCallback } from '../../../../hooks/useApproveCallback'
import { GenerateState, useGenerateTokenIdCallback } from '../../../../hooks/useGenerateTokenId'
import { DepositState, useDepositCallback } from '../../../../hooks/useDeposit'
import { useERC721Balance } from '../../../../hooks/useERC721Balance'
import { useMuonTokenId } from '../../../../hooks/useMuonTokenId'
import { useRpcChangerCallback } from '../../../../hooks/useRpcChangerCallback'
import { useFactoryIsDeployed } from '../../../../hooks/useFactoryIsDeployed'
import { useSelectedState } from '../../../../state/selected/hooks'
import { updateCurrentChain, updateTargetChain, updateTokenId } from '../../../../state/selected/actions'

import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'
import { PHASE_VIEWS } from './index'

import { DotFlashing } from '../../../Icons'
import { Card } from '../../../Card'
import { ProgressWrapper, ProgressButton } from './ProgressBar'
import { BridgeSummary } from './BridgeSummary'
import { Dropdown } from '../../../Dropdown'
import { ColumnNoWrap } from '../../../Column'
import { RowNoWrap } from '../../../Row'

const Wrapper = styled(ColumnNoWrap)`
  position: relative;
  flex: 1;
`

const NetworkSelect = styled(RowNoWrap)`
  justify-content: space-between;
  align-items: start;
  padding: 20px 20px 0 20px;
  z-index: 100;
  margin-bottom: auto;
  & > * {
    &:first-child {
      width: 320px;
    }
    &:nth-child(2) {
      margin-left: 15px;
      font-size: 15px;
      line-height: 40px;
    }
  }
`

const SummaryContainer = styled.div`
  position: absolute;
  margin: 92px 20px 0 20px;
  width: calc(100% - 40px); /* remove margins */
`

const Disclaimer = styled.div`
  display: block;
  align-items: center;
  text-align: center;
  font-size: 15px;
  margin: 0px 45px 45px 45px;
`

export const Bridge = ({ setPhaseView }) => {
  const { chainId, account } = useWeb3React()
  const dispatch = useDispatch()
  const selected = useSelectedState()
  const rpcChangerCallback = useRpcChangerCallback()

  const [targetChainId, contract, name, symbol, nftId] = useMemo(() => {
    return [
      selected.chain.target,
      selected.collection.contract,
      selected.collection.name,
      selected.collection.symbol,
      selected.nftId,
    ]
  }, [selected])

  const userOwnsNft = useERC721Balance(contract, nftId)
  const { tokenId, loading: tokenIdLoading } = useMuonTokenId(contract)
  const { factoryIsDeployed, loading: factoryIsDeployedLoading } = useFactoryIsDeployed(tokenId, targetChainId)
  const [ approvalState, approveCallback ] = useApproveCallback(contract)
  const [ generateState, generateCallback ] = useGenerateTokenIdCallback()
  const [ depositState, depositCallback ] = useDepositCallback()

  // <Deploy/> needs to know what the original chainId is before (temporarily) switching chains
  useEffect(() => {
    dispatch(updateCurrentChain(chainId))
  }, [chainId])

  useEffect(() => {
    dispatch(updateTokenId(tokenId))
  }, [tokenId])

  const [showGenerate, showGeneratePending, showGenerateDisclaimer] = useMemo(() => {
    const show = (!tokenId || tokenId == 0) && !tokenIdLoading && !factoryIsDeployed
    return [
      show,
      show && generateState === GenerateState.PENDING, // tx pending
      show && targetChainId,
    ]
  }, [tokenId, generateState, targetChainId, factoryIsDeployed])

  const [showDeploy, showDeployLoader, showDeployDisclaimer] = useMemo(() => {
    const show = !factoryIsDeployed
    return [
      show,
      factoryIsDeployedLoading, // await Web3 call
      show && !factoryIsDeployedLoading
    ]
  }, [factoryIsDeployed, factoryIsDeployedLoading])

  const [showApprove, showApproveLoader] = useMemo(() => {
    const show = approvalState !== ApprovalState.APPROVED
    return [
      show,
      show && approvalState === ApprovalState.PENDING
    ]
  }, [approvalState])

  const [showDeposit, showDepositLoader] = useMemo(() => {
    return [
      userOwnsNft,
      depositState === DepositState.PENDING
    ]
  }, [depositState, userOwnsNft])

  const [showTargetChainSwitch, showSuccessDisclaimer] = useMemo(() => {
    const show = !userOwnsNft
    return [show, show]
  }, [userOwnsNft])

  function getActionButton() {
    /**
     * Generate Muon tokenID
     */
    if (showGeneratePending) {
      return (
        <ProgressButton>
          Generating ID <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showGenerate) {
      return (
        <ProgressButton highlight={true} onClick={() => generateCallback()}>
          Generate Crosschain ID
        </ProgressButton>
      )
    }

    /**
     * Deploy Bridge Factory
     */
    if (!targetChainId) {
      return (
        <ProgressButton>
          Select a chain
        </ProgressButton>
      )
    }
    if (showDeployLoader) {
      return (
        <ProgressButton>
          Loading <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showDeploy) {
      return (
        <ProgressButton highlight={true} onClick={() => {
          setPhaseView(PHASE_VIEWS.DEPLOY)
        }}>
          Enter Deploy Mode
        </ProgressButton>
      )
    }

    /**
     * Approve
     */
    if (showApproveLoader) {
      return (
        <ProgressButton>
          Approving <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showApprove) {
      return (
        <ProgressButton highlight={true} onClick={() => approveCallback()} style={{fontSize: '1em'}}>
          Allow Portal to spend your NFT
        </ProgressButton>
      )
    }

    /**
     * Bridge NFT
     */
    if (showDepositLoader) {
      return (
        <ProgressButton>
          Bridging <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showDeposit) {
      return (
        <ProgressButton highlight={true} onClick={() => depositCallback()}>
          Bridge your NFT to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}
        </ProgressButton>
      )
    }
    if (showTargetChainSwitch) {
      return (
        <ProgressButton highlight={true} onClick={() => rpcChangerCallback(targetChainId)}>
          Switch to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}
        </ProgressButton>
      )
    }

    // We shouldn't get here
    return null
  }

  function getOptions() {
    return Object.entries(BEAUTIFIED_CHAINS_BY_CHAIN_ID).reduce((acc, [id, name]) => {
      if (chainId == id) return acc
      acc.push({ value: id, label: name })
      return acc
    }, [])
  }

  function getDropdownValue() {
    return targetChainId ? (
      <div>Bridging to <span style={{color: '#0064FA'}}>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}</span></div>
    ) : (
      <div>I want to bridge to</div>
    )
  }

  function getDisclaimer() {
    if (showGenerateDisclaimer) {
      return (
        <Disclaimer>
          You are the ONLY person in the world seeing this message! In order to bridge, you first need to generate a unique one-time Muon ID for your NFT Collection.
        </Disclaimer>
      )
    }
    if (showDeployDisclaimer) {
      return (
        <Disclaimer>
          Deploy a factory on <span style={{color: '#0064FA'}}>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}</span> in order to bridge all the NFTs within this collection. Once done, anyone can bridge their NFT without this hurdle. Be the hero your NFT Community needs <span style={{color: '#FF007A'}}>&lt;3</span>
        </Disclaimer>
      )
    }
    if (showSuccessDisclaimer) {
      return (
        <Disclaimer>
          You have successfully bridged your NFT to <span style={{color: '#0064FA'}}>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}</span>. You can switch chains to claim it, or return to bridge more NFT's!
        </Disclaimer>
      )
    }
    return null
  }

  return (
    <Wrapper>
      <SummaryContainer>
        <BridgeSummary />
      </SummaryContainer>
      <NetworkSelect>
        <Dropdown
          options={getOptions()}
          value={getDropdownValue()}
          onSelect={(chosenChainId) => dispatch(updateTargetChain(chosenChainId))}
        />
        <div>
          {BEAUTIFIED_CHAINS_BY_CHAIN_ID[chainId]} 🠒&nbsp;
          {targetChainId
            ? <span>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}</span>
            : <span style={{color: '#6F7077'}}>Select Chain</span>
          }
        </div>
      </NetworkSelect>
      {getDisclaimer()}
      <ProgressWrapper>
        <ProgressButton
          active={true}
          onClick={() => {
            setPhaseView(PHASE_VIEWS.COLLECTION)
          }}
        >Back</ProgressButton>
        {getActionButton()}
      </ProgressWrapper>
    </Wrapper>
  )
}
