import { useCallback, useRef, useState } from 'react'
import { FiGlobe } from 'react-icons/fi'
import { Theme, SupportedLocale, SUPPORTED_LOCALES, SwapWidget } from '@uniswap/widgets'

// ↓↓↓ Don't forget to import the widgets' fonts! ↓↓↓
import '@uniswap/widgets/fonts.css'
// ↑↑↑

import { useActiveProvider } from '../connectors'
import { JSON_RPC_URL } from '../constants'
import Web3Connectors from './Web3Connectors'
import styles from '../styles/Home.module.css'

const TOKEN_LIST = 'https://ipfs.io/ipns/tokens.uniswap.org';
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const theme: Theme = {
  primary: '#fcfcfc',
  secondary: '#5e5e5e',
  interactive: '#1b1b1b',
  container: '#131313',
  module: '#1b1b1b',
  accent: '#2e1e30',
  outline: '#5e5e5e',
  dialog: '#131313',
  fontFamily: 'Martian Mono',
  borderRadius: 1,
  hint: '#5e5e5e',
  // tokenColorExtraction: true,
}

export default function App() {
  // When a user clicks "Connect your wallet" in the SwapWidget, this callback focuses the connectors.
  const connectors = useRef < HTMLDivElement > (null)
  const focusConnectors = useCallback(() => connectors.current?.focus(), [])

  // The provider to pass to the SwapWidget.
  // This is a Web3Provider (from @ethersproject) supplied by @web3-react; see ./connectors.ts.
  const provider = useActiveProvider()

  // The locale to pass to the SwapWidget.
  // This is a value from the SUPPORTED_LOCALES exported by @uniswap/widgets.
  const [locale, setLocale] = useState < SupportedLocale > ('en-US')
  const onSelectLocale = useCallback((e) => setLocale(e.target.value), [])

  return (
    <div className={styles.container}>
      <div className={styles.i18n}>
        <label style={{ display: 'flex' }}>
          <FiGlobe />
        </label>
        <select onChange={onSelectLocale}>
          {SUPPORTED_LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Uniswap Swap Widget</h1>

        <div className={styles.demo}>
          <div className={styles.connectors} ref={connectors} tabIndex={-1}>
            <Web3Connectors />
          </div>

          <div className={styles.widget}>
            <SwapWidget
              theme={theme}
              jsonRpcEndpoint={JSON_RPC_URL}
              provider={provider}
              tokenList={TOKEN_LIST}
              locale={locale}
              onConnectWallet={focusConnectors}
              defaultInputTokenAddress="NATIVE"
              defaultInputAmount="1"
              defaultOutputTokenAddress={UNI}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
