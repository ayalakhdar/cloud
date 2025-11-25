
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { UserProvider } from './context/UserContext'
import AppRouter from './router/AppRouter'

function App() {

  return (
  <UserProvider>
    <AuthProvider>
        <DataProvider>
          <AppRouter></AppRouter>
        </DataProvider>
    </AuthProvider>
  </UserProvider>

  )
}

export default App
