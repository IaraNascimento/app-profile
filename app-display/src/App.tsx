import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Profile } from "./pages/Profile/Profile";

function NotFound() {
  return (
    <main className="profile-state">
      <h2>Página não encontrada</h2>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/:slug" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
