import { Provider as ReduxProvider } from 'react-redux'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ModalProvider } from 'styled-react-modal'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import GlobalStyle from '../globalStyles'
import Web3ReactManager from '../components/Web3ReactManager'
import Popups from '../components/Popups'
import { Layout } from '../components/Layout'
import { ModalBackground } from '../components/Modal'

import store from '../state'
import { getLibrary } from '../utils/library'

const Updaters = dynamic(() => import('../state/updaters'), { ssr: false })
const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), {
  ssr: false,
})

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

export default function ({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <GlobalStyle/>
            <ModalProvider backgroundComponent={ModalBackground}>
              <Popups />
              <Updaters />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ReduxProvider>
  )
}
