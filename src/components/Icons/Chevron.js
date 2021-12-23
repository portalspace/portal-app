import styled from 'styled-components'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
} from 'react-feather'

export const ChevronLeft = styled(ChevronLeftIcon)`
  color: ${props => props.color ?? 'white'};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export const ChevronDown = styled(ChevronDownIcon)`
  color: ${props => props.color ?? 'white'};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export const ChevronUp = styled(ChevronUpIcon)`
  color: ${props => props.color ?? 'white'};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
