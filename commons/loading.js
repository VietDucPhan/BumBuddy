
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
  ActivityIndicator
 } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import Css from '../libs/Css';

class loading extends Component {
  constructor(props){
    super(props);
    this.state = {
      closeBtn: true
    };
  }

  static defaultProps = {
    name:"loading",
    visible:false,
    loadingAnimation:false,
    close:function(){
      this.props.visible = !this.props.visible;
    }
  }

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    close:function(){
    },
    loadingAnimation: PropTypes.bool.isRequired,
    name: PropTypes.oneOf(['loading', 'done',"error"])
  }

  componentDidMount(){}

  close(){
    var self = this;
    self.props.close();
  }

  viewContent(){
    var self = this;
    switch (self.props.name) {
      case "loading":
        return(
          <View style={Css.middleBox}>
            <ActivityIndicator animating={true}/>
            <Text style={Css.message}>Loading</Text>
          </View>
        );
        break;
      case "done":
        return(
          <View style={Css.middleBox}>
            <Icon style={{color:"green"}} name="md-checkmark-circle" size={25} />
            <Text style={Css.message}>Done</Text>
          </View>
        );
        break;
      default:
      return(
        <View style={Css.middleBox}>
          <Icon style={{color:"red"}} name="ios-alert" size={25} />
          <Text style={Css.message}>Done</Text>
        </View>
      );

    }
  }

  render(){
    var self = this;
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={self.props.visible}
        onRequestClose={() => {self.close()}}
      >
        <View style={Css.modalContainer}>
          <View style={Css.middleBoxContainer}>
            {self.props.name !== "loading" &&
              <Icon onPress={()=>self.close()} style={Css.closeBtn} name="ios-close-circle" size={25} />
            }
            {self.viewContent()}
          </View>


        </View>
      </Modal>
    );
  }
}

module.exports = loading;
