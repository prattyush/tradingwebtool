import logo from './logo.svg';
import './App.css';

import Chart from './Chart';
import InputPage from './InputPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WaitPage from "./WaitPage";
import OrderInputCommand from "./OrderInputCommand";
import LabelStrategy from "./LabelStrategy";
import AnalyzeStrategyOld from "./AnalyzeStrategyOld";
import AnalyzeStrategy from "./AnalyzeStrategy";
import TradeReplayer from "./TradeReplayer";
import OptionsChart from "./OptionsChart";
import TradeStrategyLabelTool from "./TradeStrategyLabelTool";
import TradeReplayerOptions from "./TradeReplayerOptions";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/chart" element={<Chart />} />
            <Route path="/optionschart" element={<OptionsChart />} />
            <Route path="/wait" element={<WaitPage />} />
            <Route path="/ordercmd" element={<OrderInputCommand />} />
            <Route path="/tools/labelstrategy" element={<LabelStrategy />} />
            <Route path="/tools/analyzestrategyold" element={<AnalyzeStrategyOld />} />
            <Route path="/tools/analyzestrategy" element={<AnalyzeStrategy />} />
            <Route path="/tools/tradereplay" element={<TradeReplayer />} />
            <Route path="/tools/tradereplayoptions" element={<TradeReplayerOptions />} />
            <Route path="/tools/tradelabelstrategy" element={<TradeStrategyLabelTool />} />
            <Route path="/" element={<InputPage />} />
        </Routes>
      </Router>
  );
}

export default App;
