
import React from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Home from './components/Home/Home';
import ActorDetails from './components/ActorGame/ActorDetails';
import Navigation from './components/Home/Navigation';

import StarWarsManagementTool from './components/StarWars/StarWarsManagementTool';
import './App.css'


const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<ActorDetails />} />
          <Route path="/star-wars-management" element={<StarWarsManagementTool />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;