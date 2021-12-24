import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { Claims } from '../components/App/NFT/Claims'
import { Deposits } from '../components/App/NFT/Deposits'
import { Main } from '../components/App/NFT/Main'
import MuonLogo from '../assets/images/muon.svg'

const Container = styled.div`
  width: clamp(300px, 85%, 590px);
  margin: 0 auto;
`

const MuonBanner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: rgba(239, 239, 239, 0.5);
  gap: 5px;
  margin-top: 24px;
`

export default function NFT() {
  return (
    <Container>
      <Main/>
      <Claims/>
      <Deposits/>
      <MuonBanner>
        <Image src={MuonLogo} alt='Muon Logo' width='12px' height='10px'/>
        Powered by Muon Network
      </MuonBanner>
    </Container>
  )
}
