
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Platform
 } from 'react-native';

 var adUnitID = "ca-app-pub-4084869608143524/7020355417";

 if(Platform.OS === "ios"){
   adUnitID = "ca-app-pub-4084869608143524/4066889011";
 }

class Admob extends Component {
  constructor(props){
    super(props);
    this.state = {
      closeBtn: true
    };
  }

  static defaultProps = {
    size: 'BANNER',
    style: {}
  }

  static propTypes = {
    size: PropTypes.oneOf(['BANNER', 'SMART_BANNER', 'MEDIUM_RECTANGLE'])
  }

  componentDidMount(){}

  render(){
    var self = this;
    return(
      <View style={[styles.container, self.props.style]}>
        <Banner
          size={self.props.size}
          unitId={adUnitID}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Advert loaded');
          }}
          onAdFailedToLoad={(e) => {
            console.log(e.message);
          }

          }
           />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }
});
module.exports = Admob;
