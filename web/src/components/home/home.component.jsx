import React from "react";
import { withRouter } from "../../util/withRouter/withRouter.component";

//var navigate = useNavigate();

import UserState from "../../providers/user.component";
import { UserConsumer } from "../../providers/user.component";
import { User, UserModify } from "../../providers/user.component";

const initialState = {
    logged : false,
    email : '',
    password : '',
    passwordConfirm : '',
    rememberMe : false,
    signUpRequested : false,
    condition : {
        lowercase: false,
        capital: false,
        number: false,
        length: false,
        passwordMatch: false
    },
    message: ''
}

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = initialState;
    }

    login(setEmail, setLogged){
        const email = this.state.email;
        const password = this.state.password;
        fetch(`/checkPassword`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({ "email": email, "password": password }),
            }
        
        ).then(res => res.json()).then(result => {
            if(result.pass === 'true'){
                console.log(result);
                // if (result.password === password){
                localStorage.setItem("email", this.state.rememberMe ? email : '');
                localStorage.setItem("password", this.state.rememberMe ? password : '');
                //this.setState(initialState);
                var newState = { ...this.state };
                newState["logged"] = true;
                setLogged(true);
                setEmail(email);
                this.setState(newState);
            }
            else{
                //password is wrong
                var newState = { ...this.state };
                newState["message"] = "Email or Password is Wrong";
                this.setState(newState);
            }

        })
        .catch((err)=>{
            //email not registered
            //console.log(err);
            var newState = { ...this.state };
            newState["message"] = "Email is not registered";
            this.setState(newState);
        });
    }

    signUp() {

        //var pass = true;
        //we also have to check if the email is unique here 
        for(const [key, value] of Object.entries(this.state.condition)){
            if(!value){
                var newState = { ...this.state };
                newState["message"] = `Password must ${key === "length" ? "contain at least 8 characters" : key==="passwordMatch"? "match" : `contain ${key}`}`;
                this.setState(newState);
                return;
            }
        }

        const email = this.state.email;
        const password = this.state.password;
        //console.log(password);
        var pass = true;
        fetch(`getUser?email=${email}`).then( (res)=> res.json()).then(data =>{
            if(data){
                var newState = { ...this.state };
                newState["message"] = "Email is already registered";
                this.setState(newState);
                pass = false;
                return;
            }else{
                console.log("pass: " + pass);
                fetch('/addUser', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify({ "email": email, "password": password }),
                }).then(res => {
                    console.log(res.json());
                    var newState = { ...this.state };
                    newState["signUpRequested"] = false;
                    newState["message"] = "";
                    this.setState(newState);
                }).catch(err => {
                    console.log(err);
                    var newState = { ...this.state };
                    newState["message"] = "Server Error";
                    this.setState(newState);
                });
            }
        }).catch(err=>{
            console.log("you can add the email")
        });
    }

    goToSignUp(){
        var newState = {...this.state};
        newState["signUpRequested"] = true;
        this.setState(newState);
    }

    componentDidMount(){
        //console.log("mounteed");
        //console.log(this.state);
        this.setState(initialState);
        var newState = { ...this.state };
        const savedEmail = localStorage.getItem("email") ? localStorage.getItem("email") : "";
        const savedPassword = localStorage.getItem("password") ? localStorage.getItem("password") : "";
        //console.log(savedEmail, savedPassword);
        newState["email"] = savedEmail;
        newState["password"] = savedPassword;
        this.setState(newState);
    }

    //node: you have to use arrow function here 
    handleChange = (event)=>{
        //event.preventDefault();

        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        const name = event.target.name;
        //console.log("a change occured");
        let newState = {...this.state};
        newState[name] = value;
       
        //console.log(this.state);

        if(name === "password"){
            if(newState.password.length > 7){
                newState["condition"]["length"] = true;
            }else{
                newState["condition"]["length"] = false;
            }
            if (newState.password.match(/[a-z]/g)) {
                newState["condition"]["lowercase"] = true;
            }else{
                newState["condition"]["lowercase"] = false;
            }
            if (newState.password.match(/[A-Z]/g)) {
                newState["condition"]["capital"] = true;
            }else{
                newState["condition"]["capital"] = false;
            }
            if (newState.password.match(/[0-9]/g)) {
                newState["condition"]["number"] = true;
            }else{
                newState["condition"]["number"] = false;
            }
        }
        else if(name === "passwordConfirm"){
            if (newState.password === newState.passwordConfirm){
                newState["condition"]["passwordMatch"] = true;
            }else{
                newState["condition"]["passwordMatch"] = false;
            }
        }
        this.setState(newState);
    }

    //it is necessary for the UserConsumer to return something
    //later, the authentication must be done in a different area, globally.
    render(){
        return(
            <>
                <User.Consumer>
                    {({setLoggedInGlobal, loggedIn, setEmailGlobal, email}) => {
                        if (loggedIn){
                             return (
                                 <> 
                                    <p>You logged In</p>
                                    <p>{`Welcome you are logged in as ${email}`}</p>
                                    < button onClick={() => {this.props.navigate(`/dictionary`)}}>Go to Dictionary</button>
                                    <button onClick={()=> setLoggedInGlobal(false)}>logout</button>
                                 </>
                                  
                             )
                             
                        } else{
                            return (
                                <div>
                                    {/* <button onClick={() => setLoggedInGlobal(false)}>out</button> */}
                                    <h4 style={{ marginLeft: '30px' }} >Sign in now to access the map</ h4>
                                    <label>
                                        <input name="rememberMe" checked={this.state.rememberMe} onChange={this.handleChange} type="checkbox" style={{ marginLeft: '30px' }} /> Remember me
                                    </label>
                                    <br></br>
                                    <input onChange={this.handleChange} className="inputForm" value={this.state.email} name='email' type='email' placeholder='email' />

                                    <input onChange={this.handleChange} className="inputForm" name='password' type='password' pattern="(?=.*\d)(?=.*[a-z])(?=.* [A-Z]).{6,}" placeholder='password' value={this.state.password} />
                                    {this.state.signUpRequested ?
                                        <>
                                            <input onChange={this.handleChange} className="inputForm" name='passwordConfirm' type='password' pattern="(?=.*\d)(?=.*[a-z])(?=.* [A-Z]).{6,}" placeholder='confirm password' value={this.state.passwordConfirm} />
                                            <button id="formButton1" className="formButton" onClick={() => { this.signUp() }} type='button'>Sign up</button>
                                            <div id="message">
                                                <h3>Password must contain the following:</h3>
                                                <p id="letter" className={this.state.condition.lowercase ? "valid" : "invalid"}>A <b>lowercase</b>   letter</p>
                                                <p id="capital" className={this.state.condition.capital ? "valid" : "invalid"}>A <b>capital (uppercase) </b> letter</p>
                                                <p id="number" className={this.state.condition.number ? "valid" : "invalid"}>A <b>number</b></p>
                                                <p id="length" className={this.state.condition.length ? "valid" : "invalid"}>Minimum <b>8 characters</b></p>
                                                <p id="length" className={this.state.condition.passwordMatch ? "valid" : "invalid"}>Password Match</p>

                                            </div>
                                        </>
                                        :
                                        <>
                                            <button id="formButton" className="formButton" onClick={() => { this.login(setEmailGlobal, setLoggedInGlobal) }} type='button'>Login</button>
                                            <button id="formButton1" className="formButton" onClick={() => { this.goToSignUp() }} type='button'>Go to Sign Up</ button>
                                        </>

                                    }

                                    <h2 style={{ marginLeft: '30px', color: 'red' }} >{this.state.message}</h2>


                                </div>
                            )
                        } 
                    }}
                </User.Consumer> 
            </>
        )
    }
}

export default withRouter(Home);