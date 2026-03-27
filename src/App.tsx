import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Courses } from './components/Courses'
import { Teachers } from './components/Teachers'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="App"> 
      <Header />
      <Hero />
      <Courses />
      <Teachers />
      <FAQ />
      <Footer />
    </div>
      
  )
}

export default App
