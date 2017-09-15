import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Autocomplete from 'react-google-autocomplete';
import Upload from './Upload.jsx';

/* Import Semantic UI Components */
import {
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  List,
  Menu,
  Message,
  Segment,
  Table,
  TextArea,
  Transition
} from 'semantic-ui-react';

/** ============================================================
 * Define React Bootstrap Components
 * =============================================================
 */
// import { Grid, Row, Col } from 'react-bootstrap';
// import { Modal, MenuItem, ButtonToolbar, ControlLabel, Form, FormGroup, DropdownButton, FormControl, Radio, ButtonGroup } from 'react-bootstrap';

/** ============================================================
 * Define Store Modules
 * =============================================================
 */
import {
  handleTitleInput,
  handleContentTextArea,
  handleLocationInput,
  handleStoryLoad,
} from '../../store/modules/newpost';

import {
  handleStorySummary,
  handleStoryTitle,
} from '../../store/modules/newstory';

class CreateNewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storyFormVisible: false,
      dropdownVisible: false,
      landmark: '',
      show: false,
      storyID: 0, 
      storyName: 'None Selected',
    };
    this.geocodeLocationInput = this.geocodeLocationInput.bind(this);
    this.initializeAutocomplete = this.initializeAutocomplete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStoryFormVisibility = this.handleStoryFormVisibility.bind(this);
    this.storySubmit = this.storySubmit.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.storySelected = this.storySelected.bind(this);
  }

  componentWillMount () {
    this.props.handleStoryLoad();
  }

  geocodeLocationInput (location) {
    // calls google geocoding API to fetch lat/lng from address selected in autocomplete form
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDXLOMgs19AOUHeizaMnRwjVyzxcTGWmJ8`;
    return axios.get(url)
      .then((res) => {
        console.log('response from geocoding API: ', res);
        // action handler to update location value in state
        this.props.handleLocationInput(res.data.results[0].geometry.location);
      })
      .catch((err) => {
        console.log('(Client) Error calling Google Geocoding API');
      });
  }

  // Autocomplete feature for the form's location input field
  initializeAutocomplete () {
    let input = document.getElementById('locationInput');
    // render predictions from google autocomplete using input from location field
    let autocomplete = new google.maps.places.Autocomplete(input);
    let place;
    // listen for location selection from the dropdown
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      place = autocomplete.getPlace();
      console.log(place);
      // populate landmark object with data from google places
      let image_url;
      if (place.photos) {
        image_url = place.photos[0].getUrl({
          maxWidth: 1080
        });
      } else {
        image_url = '';
      }
      this.setState({
        landmark: {
          google_id: place.place_id,
          name: place.name,
          image_url: image_url,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      });
      console.log('landmark object: ', this.state.landmark);
      // when a place is selected, use its address property to call google geocoding API
      this.geocodeLocationInput(place.formatted_address);
    });
  }

  handleSubmit (landmark) {
    let post = {
      title: 'Placeholder',
      content: this.props.content,
      lat: this.props.location.lat,
      lng: this.props.location.lng,
      profile_id: this.props.user.id,
      profile_display: this.props.user.display,
      image_url: this.props.image_url,
      story_id: this.state.storyID
    };
    console.log(post);

    console.log('(Client) Intiating POST Request! CREATING NEW POST');

    var postObject = {
      post: post,
      landmark: this.state.landmark
    };

    return axios.post('/api/posts/new', postObject)
      .then(result => {
        console.log('(Client) Success! CREATING NEW POST');
        // TODO: Add redirection to Explore Map
      })
      .catch((err) => {
        console.log('(Client) Error! CREATING NEW POST');
        console.log(err);
      });
  }

  storySubmit () {
    console.log('Story submitting');
    const storyInfo = {
      title: this.props.storyTitle,
      summary: this.props.storySummary,
      profile_id: this.props.user.id,
    };
    return axios.post('/api/stories/new', storyInfo)
      .then(result => {
        this.setState({
          storyID: result.data.id
        })
        console.log('STORY CREATED', result);
      })
      .catch((err) => {
        console.log('STORY CREATION FAILED');
      });
  }

  submitClick () {
    this.props.handleStoryLoad();
    this.handleStoryFormVisibility();
  }

  storySelected (name) {
    console.log(name);
    this.props.stories.map((story) => {
      console.log('story is: ', story);
      if (story.title === name) {
        console.log('story ID is: ', story.id)
        localID = story.id;
        console.log(this);
        this.setState({storyID: story.id, storyName: story.title});
      }
    });
  }

  handleStoryFormVisibility = () => {
    this.setState({ storyFormVisible: !this.state.storyFormVisible });
  }

  handleDropdownVisibility = () => {
    this.setState({ dropdownVisible: !this.state.dropdownVisible })
  }

  render () {
    return (
      <Grid centered columns={2} stackable>
        <Grid.Row>
          <Upload />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button.Group size='massive' fluid={true}>
              <Button content='New Story' onClick={this.handleStoryFormVisibility}/>
              <Button.Or/>
              <Button content='Select' onClick={this.handleDropdownVisibility}/>
            </Button.Group>
            <Transition.Group animation='slide down' duration='500ms'>
              {this.state.storyFormVisible &&
              <Card fluid={true}>
                <Card.Content>
                  <Form>
                    <Input fluid={true} size='huge' placeholder='Name Your Story' onChange={(e) => this.props.handleStoryTitle(e.target.value)}/>
                    <br/>
                    <TextArea style={{fontSize: '20px'}} fluid={true} placeholder='Story Summary' onChange={(e) => this.props.handleStorySummary(e.target.value)}/>
                  </Form>
                </Card.Content>
                <Card.Content>
                  <Button.Group fluid={true}>
                    <Button size='huge' color='teal' type='submit' onClick={this.storySubmit}>OK</Button>
                    <Button size='huge' type='submit' onClick={this.handleStoryFormVisibility}>Cancel</Button>
                  </Button.Group>
                </Card.Content>
              </Card>
              }
            </Transition.Group>
            <Transition.Group animation='slide down' duration='500ms'>
              {this.state.dropdownVisible &&
              <Card fluid={true}>
                <List 
                  relaxed 
                  selection
                  size='big'
                  >
                  {this.props.stories.map((story, index) => {
                    return <List.Item key={index} onClick={() => this.storySelected(story.title)} content={story.title} value={story.title}/>
                  })}
                </List>
              </Card>
              }
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column fluid={true}>
            <Form>
              <TextArea 
                fluid={true} 
                style={{fontSize: '20px'}} 
                placeholder='Record a Memory!'
                onChange={(e) => { this.props.handleContentTextArea(e.target.value); }}
                />
              <br/>
              <br/>
              <Input
                id='locationInput'
                fluid={true}
                size='huge'
                icon='compass'
                onChange={this.initializeAutocomplete}
                placeholder='Enter a Location...' />
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Button fluid={true} size='massive' color='teal' onClick={() => this.handleSubmit(this.state.landmark)}>Publish</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
/** ============================================================
 * Define State Subscriptions
 * =============================================================
 */
const mapStateToProps = state => ({
  content: state.newpost.content,
  location: state.newpost.location,
  map: state.map.center,
  user: state.user,
  image_url: state.newpost.image_url,
  stories: state.newpost.allUserStories,
  storyTitle: state.newstory.storyTitle,
  storySummary: state.newstory.storySummary
});

/** ============================================================
 * Define Dispatches Subscriptions
 * =============================================================
 */
const mapDispatchToProps = dispatch => bindActionCreators({
  handleContentTextArea: handleContentTextArea,
  handleLocationInput: handleLocationInput,
  handleStoryLoad: handleStoryLoad,
  handleStoryTitle: handleStoryTitle,
  handleStorySummary: handleStorySummary,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewPost);