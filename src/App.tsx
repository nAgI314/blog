import './App.css'
import { Home } from './pages/home'
import { About } from './pages/about'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Ebi } from './pages/ebi';
import { ThemeProvider, useTheme } from './theme'

function Header() {
  const { lightsOff, toggleLights } = useTheme()

  return (
    <header className="appHeader">
      <button type="button" className="lightsButton" onClick={toggleLights}>
        {lightsOff ? '電気ON' : '電気OFF'}
      </button>
    </header>
  )
}
function App() {

  return (
    <ThemeProvider>
      <Router>
        <div className="appShell">
          <Header />
          <main className="appMain">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ebi" element={<Ebi />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
