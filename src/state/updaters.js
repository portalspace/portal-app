import ApplicationUpdater from './application/updater'
import BalancesUpdater from './balances/updater'
import EntriesUpdater from './entries/updater'
import ImagesUpdater from './images/updater'
import RefreshUpdaterEntries from './refresh/entries_updater'
import RefreshUpdaterBalances from './refresh/balances_updater'
import TokensUpdater from './tokens/updater'
import TransactionUpdater from './transactions/updater'

export default function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <BalancesUpdater />
      <EntriesUpdater />
      <ImagesUpdater />
      <RefreshUpdaterEntries />
      <RefreshUpdaterBalances />
      <TransactionUpdater />
      <TokensUpdater />
    </>
  )
}
