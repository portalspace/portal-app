import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { useWeb3React } from '../../../../hooks/useWeb3'
import { useIsMount } from '../../../../hooks/useIsMount'
import { updateCurrentChain, resetAll } from '../../../../state/selected/actions'

import { Card } from '../../../Card'
import { Title } from '../../../Title'
import { Overview } from './Overview'
import { Collection } from './Collection'
import { Bridge } from './Bridge'
import { Deploy } from './Deploy'

const Wrapper = styled(Card)`
  margin-top: 30px;
  height: 450px;
`

export const PHASE_VIEWS = {
  OVERVIEW: 'overview',
  COLLECTION: 'collection',
  BRIDGE: 'bridge',
  DEPLOY: 'deploy'
}

export const Main = () => {
  const dispatch = useDispatch()
  const { chainId, account } = useWeb3React()
  const [ phaseView, setPhaseView ] = useState(PHASE_VIEWS.OVERVIEW)
  const isMount = useIsMount()

  const resetState = () => {
    setPhaseView(PHASE_VIEWS.OVERVIEW)
    dispatch(resetAll())
  }

  useEffect(() => {
    if (!chainId || (!isMount && phaseView !== PHASE_VIEWS.DEPLOY)) {
      resetState()
    }
  }, [chainId])

  useEffect(() => {
    if (!isMount) {
      resetState()
    }
  }, [account])

  function getPhaseContent() {
    if (phaseView === PHASE_VIEWS.OVERVIEW) {
      return (
        <Overview
          setPhaseView={setPhaseView}
        />
      )
    }

    if (phaseView === PHASE_VIEWS.COLLECTION) {
      return (
        <Collection
          setPhaseView={setPhaseView}
        />
      )
    }

    if (phaseView === PHASE_VIEWS.BRIDGE) {
      return (
        <Bridge
          setPhaseView={setPhaseView}
        />
      )
    }

    if (phaseView === PHASE_VIEWS.DEPLOY) {
      return (
        <Deploy
          setPhaseView={setPhaseView}
        />
      )
    }
  }

  return (
    <>
      <Title>
        {phaseView === PHASE_VIEWS.OVERVIEW
          ? 'Pick a Collection'
          : phaseView === PHASE_VIEWS.COLLECTION
          ? 'Pick an NFT'
          : phaseView === PHASE_VIEWS.BRIDGE
          ? 'Bridge NFT'
          : 'Deploy Factory'}
      </Title>
      <Wrapper>
        {getPhaseContent()}
      </Wrapper>
    </>
  )
}
