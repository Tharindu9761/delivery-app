import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('screen');
const height_logo = height * 0.3;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height/10, // Moved up by decreasing the margin
  },
  logo: {
    width: height_logo,
    height: height_logo,
    marginBottom: 100, // Slightly increased the margin for better spacing
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#666666',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    alignItems: 'center',
    marginTop: 30
},
  getStart: {
    width: 250,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  getStartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
