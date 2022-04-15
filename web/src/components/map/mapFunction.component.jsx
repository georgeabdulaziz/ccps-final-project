import {useEffect, useLocation, useRef, useState} from 'react'; 
import { withRouter, useParams, useNavigate } from 'react-router-dom';
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYWJkdWxheml6IiwiYSI6ImNsMGhsZWFnZTAzMmEzYm1vZ3B5OHI3a2wifQ.WJk0CiEpVlCnk5-UcfddXw';


function MapFunction(){

    let navigate = useNavigate();
    /**
     * The useRef Hook allows you to persist values between renders.
        It can be used to store a mutable value that does not cause a re-render when updated.
        It can be used to access a DOM element directly.
        const count = useRef(0). It's like doing this: const count = {current: 0}.
     */
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const mapStyle = 'mapbox://styles/mapbox/streets-v11';

    const { email } = useParams();  
    const [email1, setEmail1] = useState(email);

    const signOutStyle = { color: 'red', float: 'right' };
    const getLocationStyle = { backgroundColor: 'grey', position: 'relative', float: 'none' };
    var welcomeMessegeStyle = { color: 'green', float : 'right', marginRight: "60px"};

    //this is exactly like component did mount in classes 
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        //console.log(lng, lat, zoom);
    });

    function doNothing(){
        console.log("do nothing");
    }

    function signOut() {
        //localStorage.clear();
        navigate("/");
    }

    function updateStyle(str){
        // this.setState({...this.state.zoom, mapStyle: str});
        // console.log(this.state);
        map.current.setStyle(str);

    }

    return (
        <>
            {/* <input readOnly id="ip" type="text" placeholder="99.238.35.3" value="99.238.35.3"/> */}
            <input onChange={()=> {doNothing();}} id="ip" type="text" placeholder="99.238.35.3" value="99.238.35.3" />
            <button style={getLocationStyle} type="button" onClick={() => { doNothing(); }} className="styles mapButton">Get Location</button>
            <button className="styles mapButton" style={signOutStyle} onClick={() => { signOut(); }}>Sign out</button>
            <p style={welcomeMessegeStyle}>{`Welcome you are logged in as ${email1}`}</p>
            <div className="styleButtons">
                <h3 className="styles">Styles</h3>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/dark-v10") }} className="styles mapButton" id="dark">Dark</button>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/satellite-v9") }} className="styles mapButton" id="satellite">Satellite</button>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/outdoors-v11") }} className="styles mapButton">Outdoors</button>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/light-v10") }} className="styles mapButton">Light</button>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/navigation-day-v1") }} className="styles mapButton">Navigation</button>

                <button onClick={() => { updateStyle("mapbox://styles/mapbox/streets-v11") }} className="styles mapButton">Default</button>
            </div>

            <div ref={mapContainer} className="map-container" />
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
        </>
    );
}

export default MapFunction;