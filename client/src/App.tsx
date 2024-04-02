import { SimplePageLayout } from "./components/layout";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import EmptyPageContent from "./components/EmptyPageContent";
import AbacusSettingsPage from "./pages/AbacusTest/AbacusSettingsPage";

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
            {/* <Route path="new" element={<AbacusTestPage />} />
            <Route path="summary" element={<AbacusQASummaryPage />} /> */}
            <Route index element={<AbacusSettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<EmptyPageContent />} />
      </Route>
    </Routes>
  );
}

export default App;
