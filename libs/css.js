import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  viewContainer1st:{
    flex:1,
    paddingTop:15
  },
  map: {
    flex: 1
  },
  locator:{
    position: "absolute",
    bottom:20,
    right:10
  },
  navigatorBtn:{
    padding:10
  },
  normalViewContainer:{
    marginTop:64,
    paddingLeft:10,
    paddingRight:10
  },
  navigatorBarStyle:{
    backgroundColor:"white"
  },
  inputText:{
    flex:1,
    textAlignVertical:"top",
    padding:10,
    borderColor:"#ccc",
    borderStyle:"dotted",
    borderWidth:1,
    marginTop:10,
    marginBottom:10
  },
  markerActionButton:{
    marginRight:20
  },
  viewDividerHorizontal:{borderColor:"#ccc",
  borderStyle:"dotted",
  borderWidth:1, marginBottom:10}
});
module.exports = styles;
