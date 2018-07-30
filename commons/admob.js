
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Text,
  ActivityIndicator,
  Platform
 } from 'react-native';
 import { AdMobBanner } from 'react-native-admob';
 import Icon from 'react-native-vector-icons/Ionicons';

 var adUnitID = "ca-app-pub-4084869608143524/6481055554";

 if(Platform.OS === "ios"){
   adUnitID = "ca-app-pub-4084869608143524/8195314673";
 }

class admob extends Component {
  constructor(props){
    super(props);
    this.state = {
      closeBtn: true
    };
  }

  static defaultProps = {
  }

  static propTypes = {
  }

  componentDidMount(){}


  render(){
    var self = this;
    return(
      <View style={styles.container}>
        <AdMobBanner
          bannerSize="banner"
          adUnitID={adUnitID}
          didFailToReceiveAdWithError={(e)=>{
            console.log("banner error", e);
          }} />
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
module.exports = admob;
