
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
  FlatList,
  SectionList,
  Button
 } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthLib from '../../libs/Auth';
import BumsLib from '../../libs/Bums';
import CacheLib from '../../libs/Cache';
import DateFormat from '../bums/tmpl/formatdate';
import Votebtn from './tmpl/votebtn';
import Morebtn from './tmpl/morebtn';
import RatingView from '../bums/tmpl/rating';
//import Admob from '../../commons/admob';

var BumModel = new BumsLib();
var Auth = new AuthLib();
var Cache = new CacheLib();
const SKIP = 0;
const LIMIT = 5;
class comments extends Component {
  constructor(props){
    super(props);
    this.state = {
      comments:[],
      showActivitiIndicator:true,
      refreshing:false,
      skip:SKIP,
      limit:LIMIT,
      infiniteLoading:true,
      bottomRefreshing:false
    };
  }

  static defaultProps = {
    finsihedRefreshing:function(){}
  }

  static navigationOptions = {
    tabBarLabel: '',
    tabBarIcon: ({ tintColor, focused }) => (
      <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline'} />
    ),
    headerTitle:'Comments',
    title:'Comments'
  };

  componentDidMount(){
    //console.log("comments.componentDidMount");
    var self = this;
    console.log("comments.componentDidMount");
    self.setState({skip:0,limit:5});
    var cacheName = "_getBumsComments";
    if(self.props.commentID){
      self._getComment();
    } else {
      if(self.props._id){
        cacheName = self.props._id;
      } else if(self.props.user_id) {
        cacheName = self.props.user_id;
      }

      Cache.getComments(cacheName,function(flag,result){
        if(flag){
          self.setState({
            comments:result.data,
            showActivitiIndicator:false,
            refreshing:false
          });
        } else {

          self._getBumsComments();
        }
      });
    }
  }

  _calculateImageHeight(imageWidth,dimensionWidth,imageHeight){
    var height = dimensionWidth/imageWidth*imageHeight;
    return {height:height,width:dimensionWidth};
  }

  _getBumsComments(){
    var self = this;
    console.log("_getBumsComments",self.state.skip);
    var data = {
      skip:self.state.skip,
      limit:self.state.limit
    };
    if(self.state.refreshing){
      data = {
        skip:SKIP,
        limit:LIMIT
      }
    }
    var cacheName = "_getBumsComments";
    if(self.props._id){
      data.bum_id = self.props._id;
      cacheName = self.props._id;
    } else if(self.props.user_id) {
      data.user_id = self.props.user_id;
      cacheName = self.props.user_id;
    }

    BumModel.getBumsComments(data,function(result){
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
        //console.log("comments._getBumsComments",result);
        var comments = {
          showActivitiIndicator:false,
          refreshing:false,
          bottomRefreshing:true
        };

        if(self.state.comments && self.state.comments[0] && result.data[0] && !self.state.refreshing){
          comments.comments = self.state.comments.concat(result.data);
          comments.skip = self.state.skip + self.state.limit;
        } else if(result.data && !result.data[0]){
          self.setState({infiniteLoading:false});
        } else {
          comments.comments = result.data;
        }

        self.setState(comments);
        Cache.setComments(cacheName,{data:self.state.comments});
        self.props.finsihedRefreshing();
      }
    });
  }



  _getComment(){
    var self = this;
    console.log("self.props.commentID",self.props.commentID);
    BumModel.getComment(self.props.commentID,function(result){
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
        console.log("comments._getComment",result);
        var comments = {
          comments:result.data,
          showActivitiIndicator:false,
          refreshing:false
        }
        self.setState(comments);
        self.props.finsihedRefreshing();
      }
    });
  }

  _onRefresh() {
    var self = this;

    self.setState({refreshing: true,skip:SKIP,limit:LIMIT,infiniteLoading:true});
    if(self.props.commentID){
      self._getComment();
    } else {
      //console.log("comments._onRefresh");
      self._getBumsComments();

    }
  }

  componentWillReceiveProps(nextProps) {
    var self = this;
    //console.log("comments.componentWillReceiveProps");
    if(nextProps.showRating){
      Cache.getRating(self.props._id,function(flag,result){
        //console.log("rating._getBum.componentWillReceiveProps",flag);
        if(flag){
          self.setState(result);
        } else {
          self._getBum();
        }
      });
    }

    if(nextProps.refreshing){
      self._getBumsComments();
    }
  }

  onEndReached(info){
    var self = this;
    console.log("onEndReached",self.state.infiniteLoading);
    if(self.state.infiniteLoading && self.state.bottomRefreshing){
      self.setState({bottomRefreshing:false});
      setTimeout(function(){
        self._getBumsComments();

      }, 1500);

    }

  }


  render() {
    const {navigate} = this.props.navigation;
    var self = this;
    //console.log("comments.render",self.state.comments);
    if(self.state.showActivitiIndicator){
      return(
        <View style={styles.container}>
          <ActivityIndicator animating={self.state.showActivitiIndicator}></ActivityIndicator>
        </View>
      );
    } else {
      return(
        <View>
          <SectionList
          sections={[{data:self.state.comments}]}
          //style={styles.sectionContainer}
          //ref={(ref) => { self.list = ref; }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={()=>{
            if(self.props._id){
              return(
                <View style={styles.bumDetailInfoContainer}>
                  <RatingView navigation={self.props.navigation} _onRefresh={self._onRefresh.bind(this)} _user={self.props.screenProps.user} refreshing={self.state.refreshing} showButton={true} showRating={true} _id={self.props._id} />
                </View>
              );
            }
          }}
          renderSectionFooter={({section}) => {
            //console.log("",section);
            return(<Button title="Load More" onPress={()=>{
              self.onEndReached();
            }}/>);
          }}
          keyExtractor={(item,index)=>item._id}
          initialNumToRender={5}
          onEndReached={self.onEndReached.bind(this)}
          onEndReachedThreshold={0.5}
          extraData={self.state.comments}
          renderItem={(info)=>{
            var obj = info.item;
            switch (obj.bum_rating) {
                  case "level1":
                    obj.bum_rating = "Trickle";
                    break;
                  case "level2":
                    obj.bum_rating = "Stream flow";
                    break;
                  case "level3":
                    obj.bum_rating = "Garden hose";
                    break;
                  case "level4":
                    obj.bum_rating = "Heavy torrent";
                    break;
                  case "level5":
                    obj.bum_rating = "Geyser";
                    break;

                }

                if(obj.overall_rating){
                  obj.overall_rating_displayname = obj.overall_rating + " stars";
                }

                if(obj && obj._id && obj.created_by){
                  return (
                    <View key={obj._id} style={styles.commentContainer}>
                      <View style={styles.commentHeader}>
                        <View style={styles.commentorProfilePictureContainer}>
                          <Image source={{uri: obj.created_by.profile_picture.secure_url}}
                     style={{width: 30, height: 30, borderRadius:15}} />

                        </View>
                        <View style={styles.commentorProfileInfoContainer}>
                          <View>
                            {obj.created_by
                              ?
                              <TouchableOpacity onPress={()=>navigate("UserDetailStack",{user_id:obj.created_by._id,username:obj.created_by.username})}>
                                <Text style={styles.createdBy}>{obj.created_by.username}</Text>
                              </TouchableOpacity>
                              :
                                <Text style={styles.commentAtPlace}></Text>
                            }
                            {self.props._id
                              ?
                                <DateFormat style={styles.commentAtPlace} created_date={obj.created_date}/>
                              :
                              <TouchableOpacity onPress={()=>navigate("BumDetail",{_id:obj.bum_id})}>
                                <Text style={styles.commentAtPlace}>{obj.name}</Text>
                              </TouchableOpacity>
                            }

                          </View>
                          <Morebtn navigation={self.props.navigation} _id={obj._id} _typeOfBtn="comment" _createdBy={obj.created_by.email} _user={self.props.screenProps.user} />
                        </View>
                      </View>
                      <View>
                        {obj.media && obj.media[0] &&
                          <Image resizeMode="contain" source={{uri: obj.media[0].secure_url}}
                   style={self._calculateImageHeight(obj.media[0].width,Dimensions.get('window').width,obj.media[0].height)} />}

                      </View>
                      <View style={styles.commentorCommentContainer}>
                        <View>
                          <Text>{obj.description}</Text>
                        </View>
                         <View style={styles.commentPointsAndResponseContainer}>
                           <Votebtn navigation={self.props.navigation} _user={self.props.screenProps.user} _id={obj._id} _upVote={obj.upVote} _downVote={obj.downVote} />
                           <View style={styles.commentPointsResponseAndRatingContainer}>
                              <Text style={styles.commentPointsAndResponseText}>{obj.overall_rating_displayname} {obj.overall_rating_displayname && <Text>-</Text>} {obj.bum_rating}</Text>

                              <Text style={styles.commentPointsAndResponseText}>{obj.points} points</Text>

                           </View>

                         </View>
                      </View>
                    </View>
                  );
                } else {
                  return(
                    <View style={styles.beTheFirstContainer}>
                      <Text style={styles.beTheFirstContainerText}>Be the first to comment</Text>
                    </View>
                  );
                }
          }}

            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </View>
      );
    }

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
    },
    bumDetailInfoContainer:{
      marginBottom:5
    },

    sectionContainer:{
      marginBottom:20
    }
  });
module.exports = comments;
