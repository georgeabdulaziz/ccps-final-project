import logo from './logo.svg';
import './App.css';
// import Home from './components/home/home.component';
// import Map from './components/map/map.component';
import React, {Suspense, lazy} from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MapFunction from './components/map/mapFunction.component';
import Dictionary from './components/dictionary/dictionary.component';
// import UserState from './providers/user.component';

// import { User } from './providers/user.component';

import UserProvider from './providers/user.component';

const Home = lazy(()=> import('./components/home/home.component'));


// function Userc() {
//   const [loggedIn, setLoggedIn] = React.useState(false);
//   const [email, setEmail] = React.useState("");

//   function setLoggedInGlobal(value){
//     setLoggedIn(value);
//   }

//   function setEmailGlobal(value) {
//     setEmail(value);
//   }
//   //i was able to pass the set logged in function in the values of the context
//   return (
//     <UserProvider>
//       {/* <button onClick={()=> { setLoggedInGlobal(false)}}>Logout</button>
//       <button onClick={() => { setLoggedInGlobal(true) }}>Login Now</button> */}
//       <Router>
//         <Suspense fallback={<div>Loading components...</div>}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/dictionary" element={<Dictionary />} />
//           </Routes>
//         </Suspense>
//       </Router>
//     </UserProvider>
//   )

// }


const App = ()=> (
  <UserProvider>
    <Router>
      <Suspense fallback={<div>Loading components...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/map/:email" element={<MapFunction />} /> */}
          <Route path="/dictionary" element={<Dictionary />} />
        </Routes>
      </Suspense>
    </Router>
  </UserProvider>
 
);
export default App;

{ /* you can do that <Route path="/map" element={<><Map /> <Map /></>} /> */}