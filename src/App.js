import {Switch, Route} from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import Jobs from './components/Jobs'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <ProtectedRoute path="/jobs" component={Jobs} />
    <Route path="/login" component={Login} />
    <ProtectedRoute path="/" component={Home} />
  </Switch>
)

export default App
