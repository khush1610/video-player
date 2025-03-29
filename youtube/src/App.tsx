import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Watch from './pages/Watch.tsx';
import Search from './pages/Search.tsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/search" element={<Search />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
