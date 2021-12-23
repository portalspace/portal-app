import React from 'react'
import styled from 'styled-components'

import { GreenCircle } from '../Icons'
import { ExternalLink } from '../Link'

const Wrapper = styled.button`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: #222A36;
  border-radius: 5px;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  outline: none;
  color: #EFEFEF;
  border: ${({ active }) => active ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)'};
  width: 100%;
  box-sizing: border-box;

  &:hover,
  &:focus {
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  ${props => !props.clickable && `
    border: 1px solid #0064FA;
    &:hover,
    &:focus {
      border: 1px solid #0064FA;
      cursor: default;
    }
  `}
`

const WrapperLeft = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: 100%;
`

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
`

export const Option = ({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
}) => {
  const content = (
    <Wrapper onClick={onClick} clickable={clickable && !active} active={active}>
      <WrapperLeft>
        <HeaderText color={color}>
          {active && (
            <CircleWrapper>
              <GreenCircle />
            </CircleWrapper>
          )}
          {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </WrapperLeft>
      <IconWrapper size={size}>
        <img src={icon.src} alt={'Icon'} />
      </IconWrapper>
    </Wrapper>
  )
  if (link) {
    return <ExternalLink href={link} target='_blank' rel="noopener noreferrer">{content}</ExternalLink>
  }

  return content
}
