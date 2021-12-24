import React, { useMemo, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { find } from 'lodash'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { DeployState, useDeployBridgeFactoryCallback } from '../../../../hooks/useDeployBridgeFactory'
import { useRpcChangerCallback } from '../../../../hooks/useRpcChangerCallback'
import { useFactoryIsDeployed } from '../../../../hooks/useFactoryIsDeployed'
import { useTokensState } from '../../../../state/tokens/hooks'
import { useSelectedState } from '../../../../state/selected/hooks'

import { BEAUTIFIED_CHAINS_BY_CHAIN_ID } from '../../../../constants/network'
import { PHASE_VIEWS } from './index'

import { DotFlashing } from '../../../Icons'
import { Card } from '../../../Card'
import { ProgressWrapper, ProgressButton } from './ProgressBar'
import { DeploySummary } from './DeploySummary'
import { Dropdown } from '../../../Dropdown'
import { ColumnNoWrap } from '../../../Column'
import { RowNoWrap } from '../../../Row'

const Wrapper = styled(ColumnNoWrap)`
  position: relative;
  flex: 1;
`

const DisabledDropdown = styled(RowNoWrap)`
  justify-content: space-between;
  align-items: start;
  padding: 20px 20px 0 20px;
  z-index: 100;
  margin-bottom: auto;
  & > * {
    &:first-child {
      width: 100%;
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

export const Deploy = ({ setPhaseView }) => {
  const { chainId } = useWeb3React()
  const { data: tokens, status: tokensStatus } = useTokensState()
  const rpcChangerCallback = useRpcChangerCallback()
  const selected = useSelectedState()

  const isLoading = useMemo(() => {
    return tokensStatus !== 'OK'
  }, [tokensStatus])

  const [currentChainId, targetChainId, currentContractAddress, tokenId] = useMemo(() => {
    return [
      selected.chain.current,
      selected.chain.target,
      selected.collection.contract,
      selected.tokenId,
    ]
  }, [selected])

  const [mainContractAddress, mainChainId] = useMemo(() => {
    if (!tokenId || isLoading) return [null, null]
    const found = find(tokens, { tokenId, isMain: true })

    // It has interacted with the bridge factory
    if (found) {
      return [
        found.contractAddress,
        found.mainChain
      ]
    // It didn't interact with the bridge, so we can assume this is the mainChain
    } else {
      return [
        currentContractAddress,
        chainId,
      ]
    }
  }, [isLoading, tokens, tokenId])

  // Is updated per block, so we know when it's deployed
  const { factoryIsDeployed, loading: factoryIsDeployedLoading } = useFactoryIsDeployed(tokenId, targetChainId)
  const [ deployState, deployCallback ] = useDeployBridgeFactoryCallback(mainContractAddress, mainChainId, targetChainId, factoryIsDeployed)

  const [showDeploy, showDeployLoading, showDeployFetching, showDeployPending] = useMemo(() => {
    const show = !factoryIsDeployed
    return [
      show,
      factoryIsDeployedLoading, // await Web3 call
      show && deployState === DeployState.LOADING, // fetching signatures
      show && deployState === DeployState.PENDING, // tx pending
    ]
  }, [factoryIsDeployed, factoryIsDeployedLoading, deployState])

  const [showPreviousChainSwitch, showTargetChainSwitch] = useMemo(() => {
    return [
      !showDeploy && chainId != currentChainId,
      showDeploy && chainId != targetChainId,
    ]
  }, [showDeploy, chainId, currentChainId, targetChainId])

  function getActionButton() {
    if (showTargetChainSwitch) {
      return (
        <ProgressButton highlight={true} onClick={() => rpcChangerCallback(targetChainId)}>
          Switch to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}
        </ProgressButton>
      )
    }
    if (showDeployLoading) {
      return (
        <ProgressButton>
          Loading <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showDeployFetching) {
      return (
        <ProgressButton>
          Fetching signatures <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showDeployPending) {
      return (
        <ProgressButton>
          Deploying Bridge <DotFlashing style={{marginLeft: '10px'}}/>
        </ProgressButton>
      )
    }
    if (showDeploy) {
      return (
        <ProgressButton highlight={true} onClick={() => deployCallback()}>
          Deploy Bridge
        </ProgressButton>
      )
    }
    if (showPreviousChainSwitch) {
      return (
        <ProgressButton highlight={true} onClick={() => rpcChangerCallback(currentChainId)}>
          Return to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[currentChainId]}
        </ProgressButton>
      )
    }
    return null
  }

  function getPreviousButton() {
    if (chainId == currentChainId) {
      return (
        <ProgressButton
          active={true}
          onClick={() => {
            setPhaseView(PHASE_VIEWS.BRIDGE)
          }}
        >Exit</ProgressButton>
      )
    }
    if (showDeploy) {
      return (
        <ProgressButton
          active={true}
          onClick={() => {
            setPhaseView(PHASE_VIEWS.OVERVIEW)
          }}
        >Leave to {BEAUTIFIED_CHAINS_BY_CHAIN_ID[chainId]}</ProgressButton>
      )
    }
    return null
  }

  function getDisclaimer() {
    if (showTargetChainSwitch) {
      return (
        <Disclaimer>
          Almost there! But first you need to switch chains down below.
        </Disclaimer>
      )
    }
    if (showDeploy) {
      return (
        <Disclaimer>
          Time to deploy the Bridge Factory! <br/>You are your communities' hero. <br/><span style={{color: '#FF007A'}}>King &lt;3</span>
        </Disclaimer>
      )
    }
    return (
      <Disclaimer>
        Bridge Factory is successfully deployed. Let's. Freaking. Bridge. 
      </Disclaimer>
    )
  }

  return (
    <Wrapper>
      <SummaryContainer>
        <DeploySummary contract={mainContractAddress} chainId={mainChainId}/>
      </SummaryContainer>
      <DisabledDropdown>
        <Dropdown
          value={(<div>Deploying on <span style={{color: '#0064FA'}}>{BEAUTIFIED_CHAINS_BY_CHAIN_ID[targetChainId]}</span></div>)}
          disabled={true}
        />
      </DisabledDropdown>
      {getDisclaimer()}
      <ProgressWrapper>
        {getPreviousButton()}
        {getActionButton()}
      </ProgressWrapper>
    </Wrapper>
  )
}
