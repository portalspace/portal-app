import React from 'react'
import styled, { css, keyframes } from 'styled-components'

const FlashingAnimation = keyframes`
  0% {
    background: #000000;
  }
  50% {
    background: rgba(0, 0, 0, 0.5);
  }
  100% {
    background: rgba(0, 0, 0, 0.25);
  }
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Dot = styled.div`
  background-color: black;
  border-radius: 50%;
  width: ${props => props.size};
  height: ${props => props.size};
  margin: 0 ${props => props.gap};
  animation: ${FlashingAnimation} 1s infinite linear alternate;
  animation-delay: ${(props) => props.delay};
`

export const DotFlashing = ({
  size = '5px',
  gap = '1.5px',
  ...rest,
}) => {
  return (
    <Wrapper {...rest}>
      <Dot delay="0s" size={size} gap={gap}/>
      <Dot delay="0.35s" size={size} gap={gap}/>
      <Dot delay="0.7s" size={size} gap={gap}/>
    </Wrapper>
  )
}
