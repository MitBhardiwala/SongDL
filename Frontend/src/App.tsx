import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { SongsPage } from "@/features/songs/SongsPage"
import HomePage from "./components/layout/HomePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes share the Layout (Header + Footer) */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Protected — requires an active session */}
          <Route element={<ProtectedRoute />}>
            <Route path="/songs" element={<SongsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
