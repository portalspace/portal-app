import React from 'react'
import { isMobile } from 'react-device-detect'
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
  background: rgba(13, 18, 29, 0.05);
  box-shadow: inset 0px 10px 10px rgba(255, 255, 255, 0.3);
`

const MobileCircle = () => {
  return (
    <svg width="700" height="530" viewBox="0 0 700 530" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_i_552_5)">
        <circle cx="350" cy="350" r="350" fill="#0D121D"/>
      </g>
      <defs>
        <filter id="filter0_i_552_5" x="0" y="0" width="700" height="710" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="10"/>
        <feGaussianBlur stdDeviation="5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.28 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_552_5"/>
        </filter>
      </defs>
    </svg>
  )
}

export const Portal = () => {
  return (
    <Wrapper>
      {isMobile ? (
        <MobileCircle/>
      ) : (
        <>
          <Circle/>
          <Glare/>
        </>
      )}
    </Wrapper>
  )
}
