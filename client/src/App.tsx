import { SimplePageLayout } from './components/layout'
import { Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/Dashboard'
import EmptyPageContent from './components/EmptyPageContent'
import AbacusSettingsPage from './pages/AbacusTest/AbacusSettingsPage'
import AbacusTestPage from './pages/AbacusTest/AbacusTestPage'
import AbacusTestSummaryPage from './pages/AbacusTest/AbacusTestSummaryPage'
import SettingsPage from './pages/settings'
import GeneralSettings from './pages/settings/GeneralSettings'

function App() {
  return (
    <Routes>
      <Route element={<SimplePageLayout />}>
        <Route path="/">
          <Route index element={<DashboardPage />} />
          <Route path="arithmetic">
            {/* <Route path="new" element={<ArithmeticTestPage />} />
            <Route path="summary" element={<ArithmeticQASummaryPage />} />
            <Route index element={<ArithmeticSettingsPage />} /> */}
          </Route>
          <Route path="abacus">
            <Route path="new" element={<AbacusTestPage />} />
            <Route path="summary/:id" element={<AbacusTestSummaryPage />} />
            <Route index element={<AbacusSettingsPage />} />
          </Route>
        </Route>
        <Route path="settings" element={<SettingsPage />}>
          <Route index element={<GeneralSettings />} />
        </Route>
        <Route path="*" element={<EmptyPageContent />} />
      </Route>
    </Routes>
  )
}

export default App
