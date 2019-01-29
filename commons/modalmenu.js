
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Text,
  ActivityIndicator,
  Dimensions
 } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import Css from '../libs/Css';
 import Modal from 'react-native-modalbox';
 var { width, height } = Dimensions.get('window');

class Modalmenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      closeBtn: true,

    };
  }

  static defaultProps = {
    visible:false
  }

  static propTypes = {
    menus: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  componentDidMount(){}

  onClosed(){
    var self = this;
    self.props.toggleModal();
  }

  render(){
    var self = this;
    var menus = self.props.menus;
    var menuLength = menus.length;
    var initHeight = 45;
    var modalHeight = (1 + menuLength) * initHeight + initHeight;
    var i = 0;
    return(
      <Modal
        coverScreen={true}
        isOpen={self.props.visible}
        ref={"modal"}
        position='bottom'
        backButtonClose={true}
        onClosed={()=>{self.onClosed()}}
        style={[Css.modalMenu, {height:modalHeight, width:width-20, backgroundColor:'rgba(241,242,243,0)'}]}
      >
        <View style={Css.modalMenuContainer}>
          {menus.map((prop, key) => {
            var additionalCss = {};
            if(key == menuLength - 1){
              additionalCss.borderBottomWidth = 0;
            }
            return(
              <View style={[Css.modalMenuButton, additionalCss]} key={key}>
                <TouchableOpacity onPress={()=>{
                  prop.func();
                  self.refs.modal.close();
                }}>
                  <Text style={Css.modalMenuContent}>{prop.name}</Text>
                </TouchableOpacity>
              </View>
            );
          i++;
          })}
        </View>
        <View style={[Css.modalMenuContainer,{marginBottom:5}]}>
          <View style={[Css.modalMenuButton, {borderBottomWidth:0, padding:0}]}>
            <TouchableOpacity onPress={()=>{
              self.refs.modal.close();
            }}>
              <Text style={[Css.modalMenuContent, Css.modalMenuButtonAlert]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
module.exports = Modalmenu;
