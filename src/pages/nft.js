import React from 'react'
import styled from 'styled-components'

import { Claims } from '../components/App/NFT/Claims'
import { Deposits } from '../components/App/NFT/Deposits'
import { Main } from '../components/App/NFT/Main'

const Container = styled.div`
  width: clamp(300px, 85%, 590px);
  margin: 0 auto;
`

export default function NFT() {
  return (
    <Container>
      <Main/>
      <Claims/>
      <Deposits/>
    </Container>
  )
}
