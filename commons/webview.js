
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Text,
  ActivityIndicator
 } from 'react-native';
 import { WebView } from "react-native-webview";

 import Css from '../libs/Css';

class webview extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidMount(){}

  render(){
    var self = this;
    return(
      <WebView
        source={{ uri: self.props.navigation.state.params.uri }}
        onLoadProgress={e => console.log(e.nativeEvent.progress)}
      />
    );
  }
}

module.exports = webview;
