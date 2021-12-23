import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { addPopup, removePopup, setOpenModal } from './actions'
import { ApplicationModal } from './reducer'

export function useBlockNumber() {
  const { chainId } = useWeb3React()
  return useSelector((state) => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal) {
  const openModal = useSelector((state) => state.application.openModal)
  return openModal === modal
}

export function useToggleModal(modal) {
  const open = useModalOpen(modal)
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}

export function useWalletModalToggle() {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useNetworkModalToggle() {
  return useToggleModal(ApplicationModal.NETWORK)
}

export function useAddPopup() {
  const dispatch = useDispatch()
  return useCallback(({ content, key, removeAfterMs }) => {
    dispatch(addPopup({ content, key, removeAfterMs }))
  }, [dispatch])
}

export function useRemovePopup() {
  const dispatch = useDispatch()
  return useCallback((key) => {
    dispatch(removePopup({ key }))
  }, [dispatch])
}

export function useActivePopups() {
  const list = useSelector((state) => {
    return state.application.popupList
  })
  return useMemo(() => list.filter((item) => item.show), [list])
}
