import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: 75,
    paddingBottom: 25,
    width: '100%',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingVertical: 50,
  },
  text_header: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 40,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#F1F0EF',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    // borderColor: '#FF6B46',
    borderWidth: 2,
  },
  changePictureText: {
    color: '#05375a',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  image: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#FF6B46',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
