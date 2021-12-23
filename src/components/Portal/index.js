import React from 'react'
import styled, { keyframes } from 'styled-components'

const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  justify-content: center;
`

const Circle = styled.div`
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 100%;
  background: #0D121D;
  box-shadow: inset 0px 10px 10px #0047FF;
`

const Glare = styled(Circle)`
  animation: ${Rotate} 8s linear infinite;
  transform-origin: 50% 50%;
  background: rgba(13, 18, 29, 0.05);
  box-shadow: inset 0px 10px 10px rgba(255, 255, 255, 0.3);
`

export const Portal = () => {
  return (
    <Wrapper>
      <Circle/>
      <Glare/>
    </Wrapper>
  )
}
