import { useEffect, useLocation, useRef, useState, useContext } from 'react';
import { withRouter, useParams, useNavigate } from 'react-router-dom';
//my key de281dbb-1445-4ce3-b6fc-997c205e560b
import { User } from '../../providers/user.component';

function Dictionary() {

    let navigate = useNavigate();
    /**
     * The useRef Hook allows you to persist values between renders.
        It can be used to store a mutable value that does not cause a re-render when updated.
        It can be used to access a DOM element directly.
        const count = useRef(0). It's like doing this: const count = {current: 0}.
     */
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [keyword, setKeyword] = useState("");


    // const { email } = useParams();
    const global = useContext(User);
    const email = global.email; 
    const [email1, setEmail1] = useState(email);

    const [shortdef, setShortdef] = useState([]);
    const [artid, setArtid] = useState("%");
    const [caption, setCaption] = useState("");

    const loggedIn = global.loggedIn;

    const signOutStyle = { color: 'red', float: 'right' };
    const getLocationStyle = { backgroundColor: 'grey', position: 'relative', float: 'none' };
    var welcomeMessegeStyle = { color: 'green', float: 'right', marginRight: "60px" };


    function doNothing() {
        console.log("do nothing");
    }

    function signOut() {
        //localStorage.clear();
        global.setLoggedInGlobal(false);
        navigate("/");
    }


    const getData = (e)=>{
        const keyword = e.target.value;
        setKeyword(keyword);
        //console.log(keyword);
    }

    async function getTranslation(){
        fetch(`dictionary/getData?keyword=${ keyword }`).then((res) => res.json()).then(data => {
            console.log(data);
            if(Object.keys(data).length>0){
                const { keyword, shortdef, artid, caption } = data;
                setKeyword(keyword);
                setArtid(artid);
                setShortdef(shortdef);
                setCaption(caption);
            }
            else{
                console.log('no data');
            }

        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <>
       {loggedIn ?
           <>
            <input onChange={getData} id="ip" type="text" placeholder="keyword" value={keyword} />
            <button style={getLocationStyle} type="button" onClick={() => { getTranslation() }} className="styles mapButton">Get Translation</button>
            <button className="styles mapButton" style={signOutStyle} onClick={() => { signOut(); }}>Sign out</button>
            <p style={welcomeMessegeStyle}>{`Welcome you are logged in as ${email1}`}</p>
            {/* <input onChange={getData} value={keyword} type="text"></input> */}
            <br></br>
            <p>{`Keyword: ${keyword}`}</p>
            {/**note: don't put <></> when doint array.map because you will get warnining for the uniqueness of each child */}
            <br></br>
                    <div>{shortdef.map((elm, index) => { return <p key={index}>{` Definition: ${elm}`}</p>})}</div>
            <img src={artid === `%` ? `https://i.imgur.com/D1nM11A.png` : `https://www.merriam-webster.com/assets/mw/static/art/dict/${artid}.gif`} alt='illustration'></img>
            <p>{`Caption: ${caption}`}</p>
            <style>
                {`
                    * {
                        margin-top : 10px;
                        margin-left : 10px; 
                    }
                `}

            </style>
            </> 
        :   
            <>
            <p>please login</p>
            <button onClick={()=> navigate("/")} >Home</button>
            </>
        }
        </>
    );
}


export default Dictionary;