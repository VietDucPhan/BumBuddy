
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
    loadingAnimation:false
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
    self.props.close()
  }

  viewContent(){
    var self = this;
    switch (self.props.name) {
      case "loading":
        return(
          <View style={styles.middleBox}>
            <ActivityIndicator animating={true}/>
            <Text style={styles.message}>Loading</Text>
          </View>
        );
        break;
      case "done":
        return(
          <View style={styles.middleBox}>
            <Icon style={{color:"green"}} name="md-checkmark-circle" size={25} />
            <Text style={styles.message}>Done</Text>
          </View>
        );
        break;
      default:
      return(
        <View style={styles.middleBox}>
          <Icon style={{color:"red"}} name="ios-alert" size={25} />
          <Text style={styles.message}>Done</Text>
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
        <View style={styles.modalContainer}>
          <View style={styles.middleBoxContainer}>
            {self.props.name !== "loading" &&
              <Icon onPress={()=>self.close()} style={styles.closeBtn} name="ios-close-circle" size={25} />
            }
            {self.viewContent()}
          </View>


        </View>
      </Modal>
    );
  }
}
  const styles = StyleSheet.create({
    modalContainer:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:'rgba(241,242,243,0.7)'
    },
    middleBoxContainer:{
      backgroundColor:"#fff",
      padding:10,
      borderRadius:10,
      width:100,
      height:100,
      borderColor:"#eee",
      alignItems:"center",
      justifyContent:"center",
      borderWidth:StyleSheet.hairlineWidth
    },
    middleBox:{
      alignItems:"center",
      justifyContent:"center"
    },
    message:{
      marginTop:10
    },
    closeBtn:{
      position:"absolute",
      top:-10,
      right:-10,
      backgroundColor:'transparent'
    }
  });
module.exports = loading;
