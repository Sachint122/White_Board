import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RoomJoin />} />
      <Route path="/room/:roomId" element={<Whiteboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
