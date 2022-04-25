import React from 'react';

import {
    HashRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import './App.css';
import Main from "./components/main";
import SynapsePending from "./components/synapsePending";
import EternalPages from './components/eternalPages';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <HashRouter>
              <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/synapse" element={<SynapsePending />} />
                  <Route path="/eternal-pages" element={<EternalPages />} />
                  <Route path="/*" element={<Navigate replace to="/" />} />
              </Routes>
          </HashRouter>
      </header>
    </div>
  );
}

export default App;
