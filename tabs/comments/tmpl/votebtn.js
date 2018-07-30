
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
 } from 'react-native';
 import Icon from 'react-native-vector-icons/Ionicons';
 import BumsLib from '../../../libs/Bums';
 var BumModel = new BumsLib();

class votebtn extends Component {
  constructor(props){
    super(props);
    this.state = {
      _upVote:[],
      _downVote:[]
    };
    this.goToCommentDetail.bind(this);
  }

  componentDidMount(){}

  _vote(_id,point){
    var self = this;
    if(self.props._user){
      BumModel.vote(_id,point,self.props._user.token,function(result){
        if(result && result.errors){
          Alert.alert(
            result.errors[0].title,
            result.errors[0].detail,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
          )
        } else {
          console.log("comments._vote",result);
          if(point>0){
            if(result && result.data && result.data[0]){
              self.setState({
                _upVote:[result.data[0].created_by.email],
                _downVote:[]
              })
            }
          } else {
            if(result && result.data && result.data[0]){
              self.setState({
                _upVote:[],
                _downVote:[result.data[0].created_by.email]
              })
            }
          }
        }
      })
    } else {
      self.props.navigation.navigate('ProfileStack');
    }
  }

  goToCommentDetail(_id){
    var self = this;
    self.props.navigation.navigate('CommentDetail',{_id:_id});
  }

  render() {
    var self = this;
    var email = "";
    if(self.props._user && self.props._user.email){
      email = self.props._user.email
    }

    var upVote = false;
    var downVote = false;
    if(self.state._upVote.length > 0){
      upVote = true;
      downVote = false;
    } else if(self.state._downVote.length > 0) {
      upVote = false;
      downVote = true;
    } else {
      downVote = self.props._downVote.indexOf(email) > -1;
      upVote = self.props._upVote.indexOf(email) > -1;
    }

    return(
      <View style={styles.commentPointsAndResponseButtonsContainer}>
          {
            upVote
              ?
              (<Icon style={styles.commentPointsAndResponseButtonActive} size={20} name="ios-thumbs-up"/>)
              :
              (<TouchableOpacity onPress={()=>self._vote(self.props._id, 1)}><Icon style={styles.commentPointsAndResponseButton} size={20} name="ios-thumbs-up"/></TouchableOpacity>)
          }
         {
           downVote
             ?
             (<Icon style={styles.commentPointsAndResponseButtonActive} size={20} color="#fff" name="ios-thumbs-down" />)
             :
             (<TouchableOpacity onPress={()=>self._vote(self.props._id, -1)}><Icon style={styles.commentPointsAndResponseButton} size={20} name="ios-thumbs-down" /></TouchableOpacity>)
         }

        <TouchableOpacity onPress={()=>self.goToCommentDetail(self.props._id)}>
         <Icon style={styles.commentPointsAndResponseButton} size={20} name="ios-chatbubbles"/>
        </TouchableOpacity>
      </View>
    );
  }
}
  const styles = StyleSheet.create({
    commentPointsAndResponseButtonsContainer:{
      flex:1,
      flexDirection:'row',
      alignItems:'center',
    },
    commentPointsResponseAndRatingContainer:{
      flexDirection:'column'
    },
    commentPointsAndResponseButton:{
      borderWidth:StyleSheet.hairlineWidth,
      color:'#888',
      borderColor:'#ccc',
      paddingTop:5,
      paddingRight:10,
      paddingBottom:5,
      paddingLeft:10,
      marginRight:5
    },
    commentPointsAndResponseButtonActive:{
      borderWidth:StyleSheet.hairlineWidth,
      color:'#000',
      borderColor:'#ccc',
      paddingTop:5,
      paddingRight:10,
      paddingBottom:5,
      paddingLeft:10,
      marginRight:5
    },
  });
module.exports = votebtn;
