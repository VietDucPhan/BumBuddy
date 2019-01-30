
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
  Dimensions
 } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import Css from '../libs/Css';

const {width, height} = Dimensions.get('window');

class Modalmenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      closeBtn: true,

    };
  }

  static defaultProps = {
    visible:false,
    toggleModal:function(){
    }
  }

  static propTypes = {
    menus: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  componentDidMount(){}

  selfToggleModal(){
    var self = this;
    self.props.toggleModal();
  }

  render(){
    var self = this;
    var menus = self.props.menus;
    var menuItemLength = menus.length + 2;
    var initLength = 50;
    var menuLength = menuItemLength * initLength;
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={self.props.visible}
        onRequestClose={()=>self.selfToggleModal()}
      >
        <View style={[Css.modalContainer, Css.modalBottomContainer]}>
          <View style={[Css.bottomBoxContainer,{width:width-20,height:menuLength}]}>
            {menus.map((prop, key) => {
               return(
                <View style={[Css.modalMenuButton,{width:width-20}]} key={key}>
                  <TouchableOpacity onPress={()=>{
                      self.selfToggleModal();
                      prop.func();
                    }}>
                    <Text style={Css.modalMenuContent}>{prop.name}</Text>
                  </TouchableOpacity>
                </View>
               );
            })}
            <View style={[Css.modalMenuButton,{width:width-20}]}>
              <TouchableOpacity style={[Css.modalMenuButton,{borderBottomWidth:0}]} onPress={()=>self.selfToggleModal()}>
                <Text style={[Css.modalMenuContent, Css.modalMenuButtonAlert]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
module.exports = Modalmenu;
