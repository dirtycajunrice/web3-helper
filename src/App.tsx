import React from 'react';

import './App.css';
import Main from "./components/main";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import SynapsePending from "./components/synapsePending";
function App() {
  return (
    <div className="App">
      <header className="App-header">
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/synapse" element={<SynapsePending />} />
                  <Route path="/*" element={<Navigate replace to="/" />} />
              </Routes>
          </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
