import { StyleSheet } from 'react-native';

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
  middleBoxMenuModalContainer:{
    width:250,
    height:'auto',
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
  },
  modalMenuContentContainer:{
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderColor:"#eee",
    alignSelf: 'stretch',
    padding:10
  },
  modalMenuContent:{
    textAlign: 'center',
    fontSize:20,
    color:"#0070c9"

  },
  container:{
    backgroundColor:"white",
    flex:1
  },
  loadingContainer:{
    height:50
  },
  actionContainer:{
    flexDirection: 'row',
    paddingTop:5,
    paddingBottom:5,
    borderTopWidth:StyleSheet.hairlineWidth,
    borderColor:"#ccc",

  },
  ratingContainers:{
    paddingRight:10,
    paddingLeft:10,
  },
  ratingContainerTop:{
    borderTopWidth:StyleSheet.hairlineWidth,
    borderRightWidth:StyleSheet.hairlineWidth,
    borderLeftWidth:StyleSheet.hairlineWidth,
    borderColor:"#4267b2"
  },
  starRatingContainerTop:{
    flexDirection:'row'
  },
  ratingContainerBottom:{
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:"#4267b2"
  },
  pickerBorderColor:{
    borderColor:"#aaa"
  },
  actionLeft:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  actionRight:{
    flex:1,
    paddingLeft:2,
  },
  button:{
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    padding:5
  },
  buttonIcon:{
    padding:5,
    marginRight:10
  },
  textInputContainer:{
    paddingBottom:5,
      padding:5
  },
  textInput:{
    padding:5,
    height:150,
    fontSize:18
  },
  profileContainer:{
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#fff",
    paddingBottom:15
  },
  profileNavigatorContainer:{
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    marginTop:10,
    paddingTop:10,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:"#fff"
  },
  profileName:{
    marginTop:10
  },
  profileButtonNavigator:{
    marginBottom:10,
    flexDirection: 'row',
    padding:5,
    //flex:1,
    //justifyContent:'flex-end',
    justifyContent: 'space-between',
    //backgroundColor:'#000'
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc'
  },
  profileButtonNavigatorLastChild:{
    borderBottomWidth:0
  },
  commentContainer:{
    flex:1,
    flexDirection: 'column',
    backgroundColor:"#fff",
    marginBottom:10,
    borderBottomWidth:StyleSheet.hairlineWidth,
    borderBottomColor:"#ccc"
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
module.exports = styles;
