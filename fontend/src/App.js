import './App.css';
import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <div className="App">
            <Route path = '/' component = { Home } exact />
            <Route path = '/dashboard' component = { Dashboard }/>
        </div>
    );
}

export default App;