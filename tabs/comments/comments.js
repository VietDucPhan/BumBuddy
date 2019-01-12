
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
import Css from '../../libs/Css';
import DateFormat from '../bums/tmpl/formatdate';
import Votebtn from './tmpl/votebtn';
import Morebtn from './tmpl/morebtn';
import RatingView from '../bums/tmpl/rating';
import Admob from '../../commons/admob';

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
      bottomRefreshing:false,
      bottomLoadingTextIndicator:"Loading..."
    };
  }

  static defaultProps = {
    finsihedRefreshing:function(){}
  }

  static navigationOptions =({ navigation }) => {
    return {
      tabBarLabel: '',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon style={{paddingTop:5, paddingBottom:5}} size={30} name={focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline'} />
      ),
      headerTitle:'Comments',
      title:'Comments',
      tabBarOnPress: ({scene, jumpToIndex}) => {
        const { route, index, focused} = scene;
        if(focused){
          navigation.state.params.scrollToTop();
        }
        jumpToIndex(index);
      }
    }
  };

  componentDidMount(){
    //console.log("comments.componentDidMount");
    var self = this;
    //console.log("comments.componentDidMount");
    this.props.navigation.setParams({
      scrollToTop: self.scrollToTop.bind(this)
    })
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
          self._onRefresh();
        }
      });
    }
  }

  _calculateImageHeight(imageWidth,dimensionWidth,imageHeight){
    var height = dimensionWidth/imageWidth*imageHeight;
    return {height:height,width:dimensionWidth};
  }

  _getBumsComments(skip){
    var self = this;
    var skip = skip || 0;
    //console.log("_getBumsComments",self.state.skip);
    var data = {
      skip:skip,
      limit:self.state.limit
    };
    var cacheName = "_getBumsComments";
    if(self.props._id){
      data.bum_id = self.props._id;
      cacheName = self.props._id;
    } else if(self.props.user_id) {
      data.user_id = self.props.user_id;
      cacheName = self.props.user_id;
    }
    BumModel.getBumsComments(data,function(result){
      var comments = {
        showActivitiIndicator:false,
        refreshing:false,
        bottomRefreshing:true,
        bottomLoadingTextIndicator:"Load more"
      };
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
        if(self.state.comments && self.state.comments[0] && result.data[0] && !self.state.refreshing && self.state.infiniteLoading){
          comments.comments = self.state.comments.concat(result.data);
          comments.skip = self.state.skip + self.state.limit;
        } else if(result.data && !result.data[0]){
          comments.infiniteLoading = false;
          comments.bottomLoadingTextIndicator = "The End";
        } else {
          comments.comments = result.data;
          comments.skip = self.state.skip + self.state.limit;
        }
        
      }
      self.setState(comments);
      Cache.setComments(cacheName,{data:self.state.comments});
      self.props.finsihedRefreshing();
    });
  }



  _getComment(){
    var self = this;
    //console.log("self.props.commentID",self.props.commentID);
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
        //console.log("comments._getComment",result);
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

    self.setState({refreshing: true , skip:0, infiniteLoading:true});
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
      self.setState({bottomRefreshing:false, bottomLoadingTextIndicator:"Loading..."});
      setTimeout(function(){
        self._getBumsComments(self.state.skip);

      }, 1500);

    }

  }

  scrollToTop(){
    var self = this;
    if(self.SectionList){
      self.SectionList.scrollToLocation({
        itemIndex:0,
        sectionIndex:0,
        viewPosition:0
      });
      setTimeout(function(){
        self._onRefresh();
      }, 500);
    }
  }


  render() {
    const {navigate} = this.props.navigation;
    var self = this;
    //console.log("comments.render",self.state.comments);
    if(self.state.showActivitiIndicator){
      return(
        <View style={Css.container}>
          <ActivityIndicator animating={self.state.showActivitiIndicator}></ActivityIndicator>
        </View>
      );
    } else {
      return(
        <View>
          <SectionList
          sections={[{data:self.state.comments}]}
          //style={styles.sectionContainer}
          ref={(ref) => { self.SectionList = ref; }}
          stickySectionHeadersEnabled={false}
          renderSectionFooter={({section}) => {
            //console.log("",section);
            if(!self.props.commentID){
              return(<Button title={self.state.bottomLoadingTextIndicator} onPress={()=>{
                self.onEndReached();
              }}/>);
            }
            
          }}
          refreshControl={
              <RefreshControl
                refreshing={self.state.refreshing}
                onRefresh={self._onRefresh.bind(this)}
              />
          }
          keyExtractor={(item,index)=>item._id}
          initialNumToRender={5}
          onEndReached={self.onEndReached.bind(this)}
          onEndReachedThreshold={0.5}
          extraData={self.state.comments}
          renderSectionHeader={()=>{
            if(self.props._id){
              return(
                <View style={Css.bumDetailInfoContainer}>
                  <Admob size="SMART_BANNER" style={{marginBottom:5}}/>
                  <RatingView navigation={self.props.navigation} _onRefresh={self._onRefresh.bind(this)} _user={self.props.screenProps.user} refreshing={self.state.refreshing} showButton={true} showRating={true} _id={self.props._id} />
                </View>
              );
            }
          }}
          renderItem={(info, index)=>{
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
                    <View key={index} style={Css.commentContainer}>
                      <View style={Css.commentHeader}>
                        <View style={Css.commentorProfilePictureContainer}>
                          <Image source={{uri: obj.created_by.profile_picture.secure_url}}
                     style={{width: 30, height: 30, borderRadius:15}} />

                        </View>
                        <View style={Css.commentorProfileInfoContainer}>
                          <View>
                            {obj.created_by
                              ?
                              <TouchableOpacity onPress={()=>navigate("UserDetailStack",{user_id:obj.created_by._id,username:obj.created_by.username})}>
                                <Text style={Css.createdBy}>{obj.created_by.username}</Text>
                              </TouchableOpacity>
                              :
                                <Text style={Css.commentAtPlace}></Text>
                            }
                            {self.props._id
                              ?
                                <DateFormat style={Css.commentAtPlace} created_date={obj.created_date}/>
                              :
                              <TouchableOpacity onPress={()=>navigate("BumDetail",{_id:obj.bum_id})}>
                                <Text style={Css.commentAtPlace}>{obj.name}</Text>
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
                      <View style={Css.commentorCommentContainer}>
                        <View>
                          <Text>{obj.description}</Text>
                        </View>
                         <View style={Css.commentPointsAndResponseContainer}>
                           <Votebtn navigation={self.props.navigation} _user={self.props.screenProps.user} _id={obj._id} _upVote={obj.upVote} _downVote={obj.downVote} />
                           <View style={Css.commentPointsResponseAndRatingContainer}>
                              <Text style={Css.commentPointsAndResponseText}>{obj.overall_rating_displayname} {obj.overall_rating_displayname && <Text>-</Text>} {obj.bum_rating}</Text>

                              <Text style={Css.commentPointsAndResponseText}>{obj.points} points</Text>

                           </View>

                         </View>
                      </View>
                    </View>
                  );
                } else if(obj.admob){
                  return(
                    <View key={index} style={Css.commentContainer}>
                      <View style={Css.commentorProfileInfoContainer}>
                        <Admob size={obj.size}/>
                      </View>
                    </View>
                  );
                } else {
                  return(
                    <View style={Css.beTheFirstContainer}>
                      <Text style={Css.beTheFirstContainerText}>Be the first to comment</Text>
                    </View>
                  );
                }
          }}
          />
        </View>
      );
    }

  }
}
module.exports = comments;
