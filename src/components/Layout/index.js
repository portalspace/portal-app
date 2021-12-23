import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { NavBar } from './NavBar'
import { Portal } from '../Portal'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-flow: column nowrap;
`

// Scroll content so we can use a semi transparent navbar.
const Content = styled.div`
  display: block;
  position: relative;
  height: calc(100vh - 55px);
  overflow: scroll;
  padding-bottom: 20px;
  @media only screen and (min-width: 767px) {
    padding-bottom: 40px;
  }
`

const PortalWrapper = styled.div`
  display: block;
  width: 100%;
  position: absolute;
  bottom: 0;
  height: ${props => props.isHomePage ? '530px' : '670px'}; /* 700px minus viewbox according to figma */
`

export const Layout = ({ children }) => {
  const { pathname } = useRouter()
  const isHomePage = useMemo(() => {
    return pathname === '/'
  }, [pathname])

  return (
    <Wrapper>
      <NavBar/>
      <PortalWrapper isHomePage={isHomePage}>
        <Portal />
      </PortalWrapper>
      <Content>
        {children}
      </Content >
    </Wrapper>
  )
}
