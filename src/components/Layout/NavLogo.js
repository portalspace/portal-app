import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-right: auto;

  &:hover {
    cursor: pointer;
  }
`

const Logo = styled.img`
  margin: 0 auto;
  height: 30px;
  margin-right: 13px;
`

const Text = styled.div`
  font-size: 20px;
  font-weight: 500;
  @media only screen and (max-width: 480px) {
    display: none;
  }
`

export const NavLogo = () => {
  return (
    <Link href="/">
      <Wrapper>
        <Logo src="/images/NavLogo.png"/>
        <Text>Portal</Text>
      </Wrapper>
    </Link>
  )
}
