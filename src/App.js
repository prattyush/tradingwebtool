import logo from './logo.svg';
import './App.css';

import Chart from './Chart';
import InputPage from './InputPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WaitPage from "./WaitPage";
import OrderInputCommand from "./OrderInputCommand";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/chart" element={<Chart />} />
            <Route path="/wait" element={<WaitPage />} />
            <Route path="/ordercmd" element={<OrderInputCommand />} />
          <Route path="/" element={<InputPage />} />
        </Routes>
      </Router>
  );
}

export default App;
