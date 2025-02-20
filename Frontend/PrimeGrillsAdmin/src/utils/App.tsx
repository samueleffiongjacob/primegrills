import Navigations from '../routes/routes'
import '../assets/styles/App.css'
import { AuthProvider } from '../context/authContext'


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

