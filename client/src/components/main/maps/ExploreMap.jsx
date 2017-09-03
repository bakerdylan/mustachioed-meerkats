import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/places/SearchBox';
import {
  handleMapMounted, 
  handleSearchBoxMounted,
  handlePlacesChanged
} from '../../../store/modules/map';

import Markers from './Markers.jsx';
import Search from './Search.jsx';
import PostList from '../PostList.jsx';

var inputStyle = {
  boxSizing: 'border-box',
  MozBoxSizing: 'border-box',
  border: '1px solid transparent',
  width: '240px',
  height: '32px',
  marginTop: '27px',
  padding: '0 12px',
  borderRadius: '1px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  fontSize: '14px',
  outline: 'none',
  textOverflow: 'ellipses',
};

const ExploreMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.handleMapMounted}
    defaultZoom={12}
    center={props.center}
  >
    <SearchBox
      ref={props.handleSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={() => props.handlePlacesChanged(props.searchBox)}
      inputPlaceholder='Search for a place!'
      inputStyle={props.inputStyle}
    />
    {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        key={index}
      />
    ))}
  </GoogleMap>
));

const mapStateToProps = state => ({
  center: state.map.center,
  bounds: state.map.bounds,
  inputStyle: inputStyle,
  containerElement: <div style={{height: '100%'}} />,
  mapElement: <div style={{height: '100%'}} />,
  markers: state.map.markers,
  searchBox: state.map._searchBox
});

const mapDispatchToProps = dispatch => bindActionCreators({
  handleMapMounted,
  handleSearchBoxMounted,
  handlePlacesChanged,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExploreMap);