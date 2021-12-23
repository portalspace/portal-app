import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { Twitter, Telegram, Github } from '../components/Icons'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: 0 auto;
  height: 100%;
`

const Title = styled.div`
  font-size: 50px;
  height: 65px;
  line-height: 65px;
  color: #EFEFEF;
  margin: 0 auto;
  margin-top: 75px;
  align-text: center;
  text-align: center;
`

const SubTitle = styled.div`
  font-size: 25px;
  max-width: 370px;
  color: #EFEFEF;
  margin: 0 auto;
  margin-top: 6px;
  align-text: center;
  text-align: center;
`

const UrlWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 22px;
`

const UrlText = styled.div`
  font-size: 15px;
  color: #83A3F6;
  align-text: center;
  text-align: center;
  height: 30px;
  line-height: 30px;
  &:hover {
    cursor: pointer;
  }
`

const Arrow = () => {
  return (
    <svg height="8" viewBox="0 0 6 8" fill="none" style={{transform: 'translateY(-1px)'}}>
      <path d="M5.39387 2.81245C6.20204 3.37629 6.20204 4.48086 5.39387 5.04469L2.50217 7.06215C1.48021 7.77514 -2.89145e-07 7.11487 -2.38053e-07 5.94603L-6.16817e-08 1.91111C-1.05899e-08 0.742268 1.48021 0.0820059 2.50217 0.794995L5.39387 2.81245Z" fill="#83A3F6"/>
    </svg>
  )
}

const Footer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: auto;
  gap: 15px;
`

const SocialsWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  gap: 10px;
`

const Disclaimer = styled.div`
  font-size: 10px;
  max-width: 230px;
  margin: 0 auto;
  margin-top: 6px;
  align-text: center;
  text-align: center;
`

export default function Home() {
  return (
    <Wrapper>
      <Title>Portal</Title>
      <SubTitle>Bridge your NFTs between your favorite blockchains</SubTitle>
      <Link href="/nft">
        <UrlWrapper>
          <UrlText>Get Bridging</UrlText>
          <Arrow />
        </UrlWrapper>
      </Link>
      <Footer>
        <SocialsWrapper>
          <Twitter fill={'#EFEFEF'}/>
          <Telegram fill={'#EFEFEF'}/>
          <Github fill={'#EFEFEF'}/>
        </SocialsWrapper>
        <Disclaimer>
          Our ERC-20 Bridge is currently under development. Join our socials to stay up to date.
        </Disclaimer>
      </Footer>
    </Wrapper>
  )
}
