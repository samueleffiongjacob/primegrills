import Navigations from '../routes/routes'
import '../assets/styles/App.css'
import { AuthProvider } from '../context/authContext'

import '../assets/styles/App.css'

function App() {
 

  return (
      <div>
        <AuthProvider >
          <Navigations />
        </AuthProvider>
      </div>
      
    
  )
}

export default App

