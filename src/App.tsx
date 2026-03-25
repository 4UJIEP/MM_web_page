import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Courses } from './components/Courses'
import { Teachers } from './components/Teachers'
import { FAQ } from './components/FAQ'
import './App.css'

function App() {
  return (
    <div className="App"> 
      <Header />
      <Hero />
      <Courses />
      <Teachers />
      <FAQ />
    </div>
      
  )
}

export default App
