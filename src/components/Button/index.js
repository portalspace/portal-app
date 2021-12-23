import React from 'react'
import styled from 'styled-components'

export const NavButton = styled.button`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  min-width: 150px;
  height: 35px;
  font-size: 15px;
  align-items: center;
  text-align: center;
  padding: 0 10px;
  border-radius: 10px;
  box-sizing: border-box;
  background: #121826;

  &:hover,
  &:focus {
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`

// Blue button with yellow/gold on active
export const PrimaryButton = styled.button`
  height: 30px;
  width: 155px;
  line-height: 30px;
  font-size: 12px;
  text-align: center;
  background: #0064FA;
  border-radius: 10px;
  padding: 0 10px;
  color: #FFFFFF;

  ${props => props.active && `
    background: #FFAF13;
    color: #000000;
    font-weight: bold;
  `}

  &:hover {
    cursor: pointer;
  }
`
