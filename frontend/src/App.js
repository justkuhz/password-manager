import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import './App.css';
import { Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route path='/' component={Homepage} exact/>
      <Route path='/dashboard' component={Dashboard} />
    </div>
  );
}

export default App;
