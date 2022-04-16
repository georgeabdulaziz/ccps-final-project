import React from "react";
import  { Suspense, lazy } from "react";
const Home = lazy(() => import('./components/home/home.component'));

//const initialState = { user : {email: '', loggedIn: false} };
export const User = React.createContext();
export const UserConsumer = User.Consumer;

export default function Userc(){
    const [loggedIn, setLoggedIn] = React.useState(false);

    function toggleLogin(){
        setLoggedIn(prevLogin => !prevLogin ); //flip 
    }

    return(
        <User.Provider value={loggedIn}>
            <button onClick={toggleLogin}>Login Now</button>
            <Home />
        </User.Provider>
    )
    
}
