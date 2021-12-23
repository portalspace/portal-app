import React, { useMemo } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { Web3Network } from '../Web3Network'
import { Web3Status } from '../Web3Status'
import { NavLogo } from './NavLogo'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 30px;
  height: 55px;
  align-items: center;
  background: ${props => props.showbackground ? 'rgba(0, 0, 0, 0.3)' : 'none'};
  box-shadow: ${props => props.showbackground ? '0px 0px 10px rgba(0, 0, 0, 0.05)' : 'none'};
  gap: 5px;
  z-index: 1;

  @media only screen and (max-width: 480px) {
    padding: 0px 20px;
  }
`

const AppButton = styled.div`
  width: 150px;
  height: 35px;
  background: #0064FA;
  border-radius: 10px;
  box-shadow: inset 0px 4px 4px rgba(0, 71, 255, 0.45);
  text-align: center;
  align-text: center;
  font-size: 15px;
  line-height: 37px;

  &:hover {
    cursor: pointer;
  }
`

export const NavBar = () => {
  const { pathname } = useRouter()
  const isHomePage = useMemo(() => {
    return pathname === '/'
  }, [pathname])

  return (
    <Wrapper showbackground={!isHomePage}>
      <NavLogo/>
      {isHomePage ? (
        <Link href='/nft'>
          <AppButton>OPEN APP</AppButton>
        </Link>
      ) : (
        <>
          <Web3Status/>
          <Web3Network/>
        </>
      )}
    </Wrapper>
  )
}
