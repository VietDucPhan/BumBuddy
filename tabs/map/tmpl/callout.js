import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  Image
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RatingView from '../../bums/tmpl/rating';


class Callout extends Component {
  constructor(props){
    super(props);
    this.state = {
      showRating:false
    }
  }

  componentDidMount(){

  }

  componentWillMount() {
  }
  //{uri:self.props.bum.links[0].url}
  render() {
    var self = this;
    return(
      <MapView.Marker
        coordinate={{
          longitude:self.props.bum.coordinate[0],
          latitude:self.props.bum.coordinate[1]
        }}
        onPress={() => {
          this.setState({showRating:true});
        }}
      >
        <MapView.Callout
          tooltip={false}
          onPress={function(){
            self.props.goToBumDetail();
          }}
        >
          <View style={styles.container}>
            <RatingView navigation={self.props.navigation} _id={self.props.bum._id} showRating={self.state.showRating}/>
          </View>
        </MapView.Callout>
      </MapView.Marker>
    );

  }
}
const styles = StyleSheet.create({
  container:{
    height:210,
    width:230,
    padding:5
  },
  imageContainer:{
    backgroundColor:'#888'
  },
  bumInfoContainer:{
    marginBottom:10,
  },
  bumDetailInfoHeaderContainer:{
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent: 'space-between',
    paddingBottom:5
  },
  bumInfoContainerNameText:{
    fontSize:14,
    fontWeight:'bold'
  },
  bumInfoContainerAddressText:{
    fontSize:12
  },
  starRating:{
    flexDirection:'row',
    alignItems:'center'
  },
  star:{
    color:"#888",
  },
  overallRating:{
    flexDirection:'column'

  },
  overallRatingText:{
    marginRight:5,
    color:"#888",
  },
  bumRating:{
    flexDirection:'column'
  },
  bumRatingText:{
    color:"#888"
  },
  imageProfile:{
    width:250,
    height: 250
  }

});
module.exports = Callout;
