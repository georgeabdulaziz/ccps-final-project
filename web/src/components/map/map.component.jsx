import React from "react";
import mapboxgl from "mapbox-gl";
import { useLocation } from "react-router-dom";

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYWJkdWxheml6IiwiYSI6ImNsMGhsZWFnZTAzMmEzYm1vZ3B5OHI3a2wifQ.WJk0CiEpVlCnk5-UcfddXw';

const signOutStyle = {color: 'red', float: 'right'};
const getLocationStyle = {backgroundColor: 'grey', position: 'relative', float: 'none'};

//let location = useLocation();
export class Map extends React.PureComponent {

    constructor(props){
        super(props);
        const email = props.match?.params?.email;
        console.log(email);
        this.state = {
            values : {
                lng: -70.9,
                lat: 42.35,
                zoom: 9,
                mapStyle: 'mapbox://styles/mapbox/streets-v11'
            },
            map : null,
            email : email
        };
        this.mapContainer = React.createRef();
    }
    

    doNothing(){
        console.log("do nothing");
    }

    updateStyle(str){
        // this.setState({...this.state.zoom, mapStyle: str});
        // console.log(this.state);
        this.state.map.setStyle(str);

    }

    componentDidMount() {
        const { lng, lat, zoom, mapStyle } = this.state.values;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom
        });
        this.setState({...this.state.values, map: map});
        
        
    }

    componentWillMount(){
        // L.mapbox.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYWJkdWxheml6IiwiYSI6ImNsMGhsZWFnZTAzMmEzYm1vZ3B5OHI3a2wifQ.WJk0CiEpVlCnk5-UcfddXw';
        // map = L.mapbox.map('map').setView([43.6576, -79.3798], 9).addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    }

    render(){
        return(
            <>
                {/* <input readOnly id="ip" type="text" placeholder="99.238.35.3" value="99.238.35.3"/> */}
                <input onChange={this.doNothing} id="ip" type="text" placeholder="99.238.35.3" value="99.238.35.3" />
                <button style={getLocationStyle} type="button" onClick={() => { this.doNothing(); }} className="styles mapButton">Get Location</button>
                <p1>{`you are logged in as ${this.state.email}`}</p1>
                <button className="styles mapButton" style={signOutStyle} onClick={()=>{this.doNothing();} }>Sign out</button>
                <div className="styleButtons">
                    <h3 className="styles">Styles</h3>

                    <button onClick={()=> {this.updateStyle("mapbox://styles/mapbox/dark-v10")}} className="styles mapButton" id="dark">Dark</button>

                    <button onClick={()=> {this.updateStyle("mapbox://styles/mapbox/satellite-v9")}} className="styles mapButton" id="satellite">Satellite</button>

                    <button onClick={() => { this.updateStyle("mapbox://styles/mapbox/outdoors-v11") }} className="styles mapButton">Outdoors</button>

                    <button onClick={() => { this.updateStyle("mapbox://styles/mapbox/light-v10") }} className="styles mapButton">Light</button>

                    <button onClick={() => { this.updateStyle("mapbox://styles/mapbox/navigation-day-v1") }} className="styles mapButton">Navigation</button>

                    <button onClick={() => { this.updateStyle("mapbox://styles/mapbox/streets-v11") }} className="styles mapButton">Default</button>
                </div>

                <div ref={this.mapContainer} className="map-container" />
            </>
        );
    }
}
