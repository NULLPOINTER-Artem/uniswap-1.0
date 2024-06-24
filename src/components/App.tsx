import { useCallback, useEffect, useRef, useState } from 'react'
import { FiGlobe } from 'react-icons/fi'
import { Theme, SupportedLocale, SUPPORTED_LOCALES, SwapWidget } from '@uniswap/widgets'

// ↓↓↓ Don't forget to import the widgets' fonts! ↓↓↓
import '@uniswap/widgets/fonts.css'
// ↑↑↑

import { useActiveProvider } from '../connectors'
import { JSON_RPC_URL } from '../constants'
import Web3Connectors from './Web3Connectors'
import styles from '../styles/Home.module.css'

const TOKEN_LIST = 'https://ipfs.io/ipns/tokens.uniswap.org'; // https://tokens.coingecko.com/uniswap/all.json https://ipfs.io/ipns/tokens.uniswap.org
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
const RFD = '0x955d5c14c8d4944da1ea7836bd44d54a8ec35ba1';
const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';

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
  const connectors = useRef<HTMLDivElement>(null)
  const focusConnectors = useCallback(() => connectors.current?.focus(), [])

  // The provider to pass to the SwapWidget.
  // This is a Web3Provider (from @ethersproject) supplied by @web3-react; see ./connectors.ts.
  const provider = useActiveProvider()

  // The locale to pass to the SwapWidget.
  // This is a value from the SUPPORTED_LOCALES exported by @uniswap/widgets.
  const [locale, setLocale] = useState<SupportedLocale>('en-US')
  const onSelectLocale = useCallback((e) => setLocale(e.target.value), [])

  const [tokenList, setTokenList] = useState<any>([]);
  const fetchTokenList = async () => {
    const res = await fetch(TOKEN_LIST, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      const dataJSON = await res.json();
      dataJSON.tokens.push({ chainId: 1, address: RFD, name: 'REFUND', symbol: 'RFD', decimals: 18 });
      setTokenList(dataJSON.tokens);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Uniswap Swap Widget</h1>

        <div className={styles.demo}>
          <div className={styles.widget}>
            {(
              <SwapWidget
                width={'100%'}
                theme={theme}
                jsonRpcEndpoint={JSON_RPC_URL}
                provider={provider}
                tokenList={TOKEN_LIST}
                onConnectWallet={focusConnectors}
                defaultInputTokenAddress="NATIVE"
                defaultInputAmount="1"
                defaultOutputTokenAddress={RFD}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
