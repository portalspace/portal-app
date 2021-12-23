import React from 'react'
import styled from 'styled-components'

export const AutoRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  text-align: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
`

export const RowNoWrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  text-align: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
`

export const RowBlock = styled(RowNoWrap)`
  justify-content: center;
  flex: 1;
  height: 100%;
`
