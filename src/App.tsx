import { Header } from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Schedule } from './pages/Schedule'
import { Courses } from './pages/Courses'
import { Home } from './pages/Home'
import { CourseDetail } from './pages/CourseDetail'
import './App.css'
import { Footer } from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import { CabinetSchedule } from './pages/CabinetSchedule'
import { CabinetProfile } from './pages/CabinetProfile'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            {/*Главная страница */}
            <Route path='/' element={<Home />} />
            {/*Страница расписания */}
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/courses' element={<Courses />} />

            {/*страницы курса*/}
            <Route path='/course/:slug' element={<CourseDetail />} />
            {/* Личный кабинет */}
            <Route path='/cabinet/schedule' element={<CabinetSchedule />} />
            <Route path='/cabinet/profile' element={<CabinetProfile />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
