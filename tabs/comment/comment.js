
import React, { Component } from 'react';
import {
  StyleSheet,
  AppRegistry,
  View,
  Dimensions,
  TouchableOpacity,
  Navigator,
  Text,
  ScrollView,
  Image,
  Alert,
  Slider,
  ActivityIndicator,
  RefreshControl,
  FlatList
 } from 'react-native';
 import AuthLib from '../../libs/Auth';
 import BumsLib from '../../libs/Bums';
import Icon from 'react-native-vector-icons/Ionicons';
import CommentsView from '../comments/comments';
import CommentDetailView from '../comments/tmpl/commentdetail';
var BumModel = new BumsLib();
var Auth = new AuthLib();

class comment extends Component {
  constructor(props){
    super(props);
    this.state = {
      comments:[],
      showActivitiIndicator:true,
      refreshing:false
    };
  }

  static navigationOptions = {
    tabBarLabel: '',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline'} />
    ),
    headerTitle:'Comment',
    title:'Comment'
  };

  componentDidMount(){
    //console.log("comments.componentDidMount");
    var self = this;
  }


  render() {
    const {navigate} = this.props.navigation;
    var self = this;
    //console.log("comments.render",self.state.comments);
    return(
      <View style={{flex:1}}>
        <ScrollView>
          <CommentsView screenProps={{user:self.props.screenProps.user}} commentID={self.props.navigation.state.params.commentID} navigation={self.props.navigation}/>
          <CommentDetailView screenProps={{user:self.props.screenProps.user}} commentID={self.props.navigation.state.params.commentID} navigation={self.props.navigation}/>
        </ScrollView>
      </View>
    )
  }
}
  const styles = StyleSheet.create({
    commentContainer:{
      flex:1,
      flexDirection: 'column',
      backgroundColor:"#fff",
      marginBottom:5
    },
    commentHeader:{
      flex:1,
      flexDirection: 'row',
      backgroundColor:"#fff",

    },
    commentorProfilePictureContainer:{
      backgroundColor:"#fff",
      padding:5
    },
    commentorProfileInfoContainer:{
      flex:1,
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'space-between',
      backgroundColor:"#fff",
      padding:5
    },
    createdBy:{
      fontWeight:"500"
    },
    commentAtPlace:{
      fontSize:12
    },
    commentorCommentContainer:{
      flex:1,
      backgroundColor:"#fff",
      padding:10
    },
    commentPointsAndResponseContainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      paddingTop:5,
      paddingBottom:5
    },
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
    commentPointsAndResponseText:{
      color:'#888'
    },
    beTheFirstContainer:{
      alignItems:'center',
      marginTop:10
    },
    beTheFirstContainerText:{
      color:"#ccc"
    }
  });
module.exports = comment;
