import React from "react";


// const initialState = { user : {email: '', loggedIn: false} };
export const User = React.createContext();
export const UserConsumer = User.Consumer;

export function UserModify(){
    return React.useContext(User);
}

function UserProvider({children}) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [email, setEmail] = React.useState("");

    function setLoggedInGlobal(value) {
        setLoggedIn(value);
    }

    function setEmailGlobal(value) {
        setEmail(value);
    }

    return(
        <User.Provider value={{ "setLoggedInGlobal": setLoggedInGlobal, "loggedIn": loggedIn, "email": email, "setEmailGlobal": setEmailGlobal }}>
            {children}
        </User.Provider>
    )
    
}
export default UserProvider;