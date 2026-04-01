import { Header } from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { Schedule } from './pages/Schedule'
import { Home } from './pages/Home'
import './App.css'
import { Footer } from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          /*Главная страница */
          <Route path='/' element={<Home />}/>
          /*Страница расписания */
          <Route path='/schedule' element={<Schedule />}/>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>  
  )
}

export default App
