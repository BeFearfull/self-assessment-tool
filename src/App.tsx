import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import History from './pages/History'
import ResultRoute from './pages/ResultRoute'
import TestPage from './pages/TestPage'
import { loadTheme, saveTheme } from './storage'
import { ThemeContext } from './theme'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const initial = loadTheme()
    document.documentElement.classList.toggle('dark', initial === 'dark')
    return initial
  })

  function toggle() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      saveTheme(next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/test/:mockId" element={<TestPage />} />
            <Route path="/test/:mockId/result" element={<ResultRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
