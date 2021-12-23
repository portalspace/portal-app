import React, { useState, useRef, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useOnOutsideClick } from '../../hooks/useOnOutsideClick'
import { ChevronDown } from '../Icons'

const Wrapper = styled.div`
  float: left;
  overflow: hidden;
  &:hover {
    display: block;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  background: #0D121D;
  border: 1.5px solid ${props => props.isOpen ? '#000000' : props.highlight ? '#0064FA' : '#000000'};
  border-radius: ${props => props.isOpen ? '10px 10px 0px 0px' : '10px'};
  height: 40px;
  font-size: 20px;
  line-height: 37px; /* height - (2 * border height) */
  text-align: left;
  padding: 0 20px;
  color: #888C92;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`

const StyledChevron = styled(ChevronDown)`
  transition: transform 0.5s ease-out;
  ${props => props.isopen && css`
    transform: scaleY(-1);
  `};
`

const List = styled.ul`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  background: #0D121D;
  border-radius: 0px 0px 10px 10px;
  border: 1.5px solid #000000;
  border-top: none;
  overflow: hidden;

  & > * {
    &:not(:last-child) {
      border-bottom: 1.5px solid #000000;
    }
  }
`

const ListItem = styled.li`
  list-style: none;
  text-align: left;
  height: 40px;
  border-top: none;
  line-height: 40px;
  padding: 0 20px;

  &:hover {
    cursor: pointer;
    background: #3B475B;
  }
`

export const Dropdown = ({
  options = [],
  value = null,
  placeholder = 'Select',
  onSelect = () => {},
  disabled = false,
}) => {
  const ref = useRef()
  const [ isOpen, setIsOpen ] = useState(false)
  const [ selectedOption, setSelectedOption ] = useState(null)
  const toggle = () => {
    !disabled && setIsOpen(!isOpen)
  }
  useOnOutsideClick(ref, () => setIsOpen(false));

  return (
    <Wrapper ref={ref}>
      <Header onClick={toggle} isOpen={isOpen} highlight={selectedOption}>
        {value || placeholder}
        {!disabled && <StyledChevron isopen={isOpen ? 1 : 0}/>} {/*sorry this line looks weird but React somehow doesn't like the normal way*/}
      </Header>
      <List isOpen={isOpen}>
        {options.map((option, i) => (
          <ListItem key={i} onClick={() => {
            onSelect(option.value)
            toggle()
            setSelectedOption(option.value)
          }}>
            {option.label}
          </ListItem>
        ))}
      </List>
    </Wrapper>
  )
}
