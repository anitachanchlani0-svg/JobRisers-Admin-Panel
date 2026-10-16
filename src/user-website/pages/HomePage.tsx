import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import CategoriesSection from '../components/CategoriesSection'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
      </main>
      <Footer />
    </>
  )
}
