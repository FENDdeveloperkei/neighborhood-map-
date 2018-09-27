import React, { Component } from 'react';
import Filter from './components/Filter.jsx';
import './App.css';

class App extends Component {
    state = {
        query: '',
        map: '',
        markers: [],
        infowindow: '',
        contents: [],
        filtered: [],
        hideMarkers: []
    };

    static defaultProps = {
        locations: [
            {name: 'The Pfield Stadium', loc: {lat: 30.4456494, lng: -97.6326804}, address: '1440 W. Pecan St, Pflugerville, TX 78660', phone: '512-594-0000', mascot: 'Pfield', wiki: 'https://en.wikipedia.org/wiki/Pflugerville_High_School'},
            {name: 'Connally High School', loc: {lat: 30.4192234, lng: -97.6762375}, address: '13212 N Lamar Blvd, Austin, TX 78753', phone: '512-594-0800', mascot: 'Cougars', wiki: 'https://en.wikipedia.org/wiki/John_B._Connally_High_School'},
            {name: 'Pflugerville High School',loc: {lat: 30.4448663, lng: -97.6337909}, address: '1301 W Pecan St, Pflugerville, TX 78660', phone: '512-594-0500', mascot: 'Panthers', wiki: 'https://en.wikipedia.org/wiki/Pflugerville_High_School'},
            {name: 'Hendrickson High School',loc: {lat: 30.4656629, lng: -97.5878583}, address: '19201 Colorado Sand Dr, Pflugerville, TX 78660', phone: '512-594-1100', mascot: 'Hawks', wiki: 'https://en.wikipedia.org/wiki/Hendrickson_High_School'},
            {name: 'Weiss High School',loc: {lat: 30.4291442, lng: -97.56574520000001}, address: '5201 Wolf Pack Dr, Pflugerville, TX 78660', phone: '512-594-1400', mascot: 'Wolves', wiki: 'https://en.wikipedia.org/wiki/Pflugerville_Independent_School_District'},
            {name: 'Pflugerville Academic Center of Excellence',loc: {lat: 30.446406, lng: -97.63657909999999}, address: '1401-B W Pecan St, Pflugerville, TX 78660', phone: '512-594-1900', mascot: 'PACE', wiki: 'https://en.wikipedia.org/wiki/Pflugerville_Independent_School_District'}
        ]
    };

    handleFilter(query) {
        // set state of query, setting visibility of each marker
        this.setState({ query });
        this.state.markers.map(marker => marker.setVisible(true));

        // filter locations based on query, set state of filtered
        if (query) {
            const filtered = this.props.locations.filter(location => location.name.toLowerCase().includes(this.state.query.toLowerCase()));
            this.setState({ filtered });

            // hide markers that are not searched for and update its state
            const hideMarkers = this.state.markers.filter(marker => filtered.every(filteredLocation => filteredLocation.name !== marker.title));
            hideMarkers.forEach(marker => marker.setVisible(false));
            this.setState({ hideMarkers });
        } else {
            this.state.markers.forEach(marker => marker.setVisible(true));
        }
    }

    componentDidMount() {
        const apiKey = 'AIzaSyBuOtZ4Xw9Wo4EK96HJ5Xmrs4Rz9sv5P1c';
        loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);
        window.initMap = this.initMap.bind(this);
    }

    initMap() {
        // initialize the whole map
        const markers = [];
        const contents = [];
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 30.44837, lng: -97.6423},
            zoom: 13,
            mapTypeId: 'roadmap',
            mapTypeControl: false,
            streetViewControl: true
        });
        const infowindow = new window.google.maps.InfoWindow();
        this.props.locations.filter(location => location.name.toLowerCase().includes(this.state.query.toLowerCase())).forEach(location => {
            //create content string for each info window
            const contentString = `
                <div class="info-content">
                    <h2>${location.name}</h2>
                </div>
                <p>Mascot: ${location.mascot}</p>
                <p>Address: <a href="https://maps.google.com/?q=${location.address}">${location.address}</a></p>
                <p>Phone: <a href="tel:${location.phone}">${location.phone}</a></p>
                <p><a href=${location.wiki}>Check out the ${location.mascot} on Wikipedia</a></p>
            `;
            // create a marker for each location
            const marker = new window.google.maps.Marker({
                position: location.loc,
                map: map,
                title: location.name,
                animation: window.google.maps.Animation.DROP
            });
            markers.push(marker);
            contents.push(contentString);
            // set the info window content to location info and open on marker click
            marker.addListener('click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
                // animate the markers on click
                marker.setAnimation(window.google.maps.Animation.BOUNCE)
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 500);
            });
            // close info windows when map is clicked
            map.addListener('click', function() {
                if (infowindow) {
                    infowindow.close();
                }
            })
        });
        this.setState({ map, markers, infowindow, contents });
    }

    render() {
        const {query, map, markers, contents, infowindow, filtered, hideMarkers} = this.state;
        const {locations} = this.props;
        return (
            <main className="app-container">
                <header className="header">
                    <input type="text" placeholder="Filter items" className="search" onChange={event => this.handleFilter(event.target.value)} value={query} aria-label="Filter search input" tabIndex={1} />
                    <h1 className="title">Map of Pflugerville, TX</h1>
                </header>
                <Filter query={query} locations={locations} map={map} markers={markers} contents={contents} infowindow={infowindow} filtered={filtered} hideMarkers={hideMarkers} />
                <div id="map" role="application" aria-label="map"></div>
            </main>
        )
    }
}

// no libraries used, loading script tags the old fashioned way
function loadScript(url) {
    let index = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
    script.onerror = function() {
        document.write('Error loading Map. Please try again.')
    };
}

export default App;
