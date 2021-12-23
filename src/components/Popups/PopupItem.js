import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring'
import { useSpring } from '@react-spring/web'

import { useRemovePopup } from '../../state/application/hooks'
import TransactionPopup from './TransactionPopup'
import MessagePopup from './MessagePopup'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  width: 100%;
  margin-bottom: 10px;
  background: #212936;
  border-radius: 10px;
  box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.7);
  -moz-box-shadow:    inset 0px 0px 1px rgba(255, 255, 255, 0.7);
  -webkit-box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.7);
`

const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 1px;
  background-color: ${props => props.success ? '#00E376' : '#DC5151'}; /* green or red */
`

const AnimatedFader = animated(Fader)

export default function PopupItem({ removeAfterMs, content, popKey }) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])

  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined },
  })

  const { summary: { eventName }} = content
  return (
    <Wrapper>
      {eventName === 'message'
        ? <MessagePopup content={content} removeThisPopup={removeThisPopup}/>
        : <TransactionPopup content={content} removeThisPopup={removeThisPopup}/>
      }
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} success={content.success}/> : null}
    </Wrapper>
  )
}
