
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Inicio from './pages/Inicio'
import Header from './components/Header'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import Inventario from './pages/Inventario'


function App() {


  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100"> {/* Contenedor principal */}
          <Header />
          <div className="row flex-grow-1"> {/* Contenido principal */}
            <SideBar />
            <div className="col"> {/* Contenido principal */}
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="*" element={<Inicio />} />
              </Routes>
            </div>
          </div>
          <Footer /> {/* Footer siempre al final */}
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
