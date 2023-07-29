
import React from 'react';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Home from './Home/Home';
import ActorDetails from './ActorGame/ActorDetails';
import Navigation from './Home/Navigation';

import StarWarsManagementTool from './StarWars/StarWarsManagementTool';
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