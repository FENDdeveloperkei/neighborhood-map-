import React, { Component } from 'react';

class Filter extends Component {
    handleClicks(location) {
        const {infowindow, map, contents, markers} = this.props;
        // filter the markers that match the specific location name then onClick show info window
        markers.filter(marker => marker.title === location.name).forEach(marker => {
            infowindow.setContent(String(contents.filter(content => String(content).slice(5).includes(location.name))));
            infowindow.open(map, marker);
            // set bounce animation for the marker that is clicked
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
            setTimeout(function() {
                marker.setAnimation(null)
            }, 500)
        });
    }

    render() {
        const {locations, query} = this.props;
        return (
            <div className="content" aria-label="List of High Schools in Pflugerville">
                <ul>
                    {locations
                        .filter(location => location.name.toLowerCase().includes(query.toLowerCase()))
                        .map((location, index) => {
                            return <li className="list-item" key={index} onClick={this.handleClicks.bind(this, location)} tabIndex={1}>{location.name}</li>})
                    }
                </ul>
            </div>
        )
    }
}

export default Filter;
