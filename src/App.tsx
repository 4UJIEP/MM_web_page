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
import { CabinetJournal } from './pages/CabinetJournal/CabinetJournal'
import { CabinetNotifications } from './pages/CabinetNotifications'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NotFound } from './pages/NotFound'
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop'
import { TeachersPage } from './pages/TeachersPage/TeachersPage'
import { useEffect } from 'react'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app">
          <Header />
          <Routes>
            {/*Главная страница */}
            <Route path='/' element={<Home />} />
            {/*Страница расписания */}
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/teachers' element={<TeachersPage />} />

            {/*страницы курса*/}
            <Route path='/course/:slug' element={<CourseDetail />} />

            {/* Личный кабинет — только для авторизованных */}
            <Route element={<ProtectedRoute />}>
              <Route path='/cabinet/schedule' element={<CabinetSchedule />} />
              <Route path='/cabinet/profile' element={<CabinetProfile />} />
              <Route path='/cabinet/journal' element={<CabinetJournal />} />
              <Route path='/cabinet/notifications' element={<CabinetNotifications />} />
            </Route>

            {/* 404 */}
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
