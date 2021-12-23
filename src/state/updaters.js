import ApplicationUpdater from './application/updater'
import BalancesUpdater from './balances/updater'
import EntriesUpdater from './entries/updater'
import ImagesUpdater from './images/updater'
import RefreshUpdater from './refresh/updater'
import TokensUpdater from './tokens/updater'
import TransactionUpdater from './transactions/updater'

export default function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <BalancesUpdater />
      <EntriesUpdater />
      <ImagesUpdater />
      <RefreshUpdater />
      <TransactionUpdater />
      <TokensUpdater />
    </>
  )
}
