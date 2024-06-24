import styles from '../styles/Connectors.module.css'
import { connectors, Web3Connector } from '../connectors'
import { useCallback } from 'react'

function Connector({ web3Connector }: { web3Connector: Web3Connector }) {
  const [connector, hooks] = web3Connector
  const isActive = hooks.useIsActive()

  const onClick = useCallback(() => {
    if (isActive) {
      connector.deactivate()
    } else {
      connectors.forEach(([connector]) => connector.deactivate())
      connector.activate()
    }
  }, [connector, isActive])

  return (
    <div className={styles.connector}>
      {!isActive && (
        <button className={styles.btnWallet} type='button' onClick={onClick}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default function Connectors() {
  return (
    <div className={styles.connectors}>
      {connectors.map((web3Connector, index) => (
        <Connector key={index} web3Connector={web3Connector} />
      ))}
    </div>
  )
}
