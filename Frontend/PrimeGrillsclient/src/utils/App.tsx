import Navigations from '../routes/routes'
import '../assets/styles/App.css'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'


function App() {
 

  return (
    <AuthProvider>
      <CartProvider> {/* Wrapper for dynamic cart population */}
        <Navigations />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
