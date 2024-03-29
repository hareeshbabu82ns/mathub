import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SimplePageLayout from './pages/SimplePageLayout';
import ArithmeticTestPage from './pages/ArithmeticTest/ArithmeticTestPage';
import ArithmeticSettingsPage from './pages/ArithmeticTest/SettingsPage';
import ArithmeticQASummaryPage from './pages/ArithmeticTest/QASummaryPage';
import AbacusTestPage from 'pages/AbacusTest/AbacusTestPage';
import AbacusSettingsPage from './pages/AbacusTest/SettingsPage';
import AbacusQASummaryPage from './pages/AbacusTest/QASummaryPage';

function App() {
  return (
    <Routes>
      {/* All Simple Page Layout Routes goes under here */}
      <Route element={<SimplePageLayout />}>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="arithmetic">
            <Route path="new" element={<ArithmeticTestPage />} />
            <Route path="summary" element={<ArithmeticQASummaryPage />} />
            <Route index element={<ArithmeticSettingsPage />} />
          </Route>
          <Route path="abacus">
            <Route path="new" element={<AbacusTestPage />} />
            <Route path="summary" element={<AbacusQASummaryPage />} />
            <Route index element={<AbacusSettingsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
