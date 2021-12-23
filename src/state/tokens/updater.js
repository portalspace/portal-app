import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchTokens } from './reducer'

export default function Updater() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchTokens())
  }, [dispatch])
  return null
}
