import {
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ArithmeticTestPage from "./pages/ArithmeticTest/ArithmeticTestPage";
import SettingsPage from "./pages/ArithmeticTest/SettingsPage";
import QASummaryPage from "./pages/ArithmeticTest/QASummaryPage";
import SimplePageLayout from "./pages/SimplePageLayout";

function App() {
  return (
    <Routes>
      {/* All Simple Page Layout Routes goes under here */}
      <Route element={<SimplePageLayout />} >
        <Route path="/" >
          <Route index element={<HomePage />} />
          <Route path="arithmetic" >
            <Route path="new" element={<ArithmeticTestPage />} />
            <Route path="summary" element={<QASummaryPage />} />
            <Route index element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
