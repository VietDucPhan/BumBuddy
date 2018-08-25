
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
    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={self.props.visible}
        onRequestClose={()=>self.selfToggleModal()}
      >
        <View style={Css.modalContainer}>
          <View style={[Css.middleBoxContainer,Css.middleBoxMenuModalContainer]}>
            {menus.map((prop, key) => {
               return(
               <View style={Css.modalMenuContentContainer} key={key}>
                  <TouchableOpacity onPress={()=>{
                    self.selfToggleModal();
                    prop.func();
                  }}>
                    <Text style={Css.modalMenuContent}>{prop.name}</Text>
                  </TouchableOpacity>
                </View>
               );
            })}
            <View style={[Css.modalMenuContentContainer,{borderBottomWidth:0}]} >
              <TouchableOpacity onPress={()=>self.selfToggleModal()}>
                <Text style={Css.modalMenuContent}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
module.exports = Modalmenu;
