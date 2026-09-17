import React from 'react'
import StudentsDetails from './StudentsDetails'
import LoginPage from './loginpage'
import './App.css'

const App = () => {
  const [user, setUser] = React.useState(null)

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Epaei / Student records</p>
          <p className="signed-in">Signed in as {user.name}</p>
        </div>
        <button className="logout-button" type="button" onClick={() => setUser(null)}>Sign out</button>
      </header>
      <StudentsDetails />
    </div>
  )
}

export default App