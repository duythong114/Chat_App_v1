import AddRoomModal from './components/Modals/AddRoomModal'
import InviteMemberModal from './components/Modals/InviteMemberModal'
import { AppProvider } from './components/wrapper/AppProvider'
import { AuthProvider } from './components/wrapper/AuthProvider'
import Router from './components/wrapper/Router'
import paths from './constant/paths'

function App() {

  return (
    <AuthProvider>
      <AppProvider>
        <Router defaultRoute={paths.login} />
        <AddRoomModal />
        <InviteMemberModal />
      </AppProvider>
    </AuthProvider>
  )
}

export default App
