import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Profile } from "./pages/Profile/Profile";
import { NotFound } from "./pages/NotFound/NotFound";

import "./App.scss";

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
