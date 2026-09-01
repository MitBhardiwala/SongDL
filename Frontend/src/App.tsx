import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { SongsPage } from "@/features/songs/SongsPage"
import { CollectionPage } from "@/features/songs/CollectionPage"
import HomePage from "./components/layout/HomePage"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
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
            <Route path="/collection" element={<CollectionPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
    </>
  )
}

export default App
