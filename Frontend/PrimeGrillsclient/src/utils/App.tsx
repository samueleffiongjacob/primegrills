import Navigations from '../routes/routes'
import '../assets/styles/App.css'
import { CartProvider } from '../context/CartContext'


function App() {
 

  return (
    <CartProvider> {/* Wrapper for dynamic cart population */}
      <Navigations />
    </CartProvider>
  )
}

export default App
