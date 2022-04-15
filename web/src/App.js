import logo from './logo.svg';
import './App.css';
// import Home from './components/home/home.component';
// import Map from './components/map/map.component';
import React, {Suspense, lazy} from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//const Map = lazy(()=> import("./components/map/map.component"))
import { Map } from './components/map/map.component';
import MapFunction from './components/map/mapFunction.component';

const Home = lazy(()=> import('./components/home/home.component'));

// function App() {
//   return (
//     <div>
//       <Home />
//       <br></br>
//       <Map />
//     </div>


//   );
// }


const App = ()=> (
  <Router>
    <Suspense fallback={<div>Loading components...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map/:email"  element={<MapFunction />} />
      </Routes>
    </Suspense>
  </Router>
);
export default App;

{ /* you can do that <Route path="/map" element={<><Map /> <Map /></>} /> */}