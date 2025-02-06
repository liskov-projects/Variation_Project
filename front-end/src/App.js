import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        {
            ["/", "/home"].map((path, index)=>
              <Route key={ index} path={path} element={<Home/>}/>
            )
          }
        </Routes>
      </Router>
    </div>
  );
}

export default App;
