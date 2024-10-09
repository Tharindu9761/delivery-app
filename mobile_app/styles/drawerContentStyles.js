import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6B46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  drawerFooter: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Full width of the container
  },
  signout: {
    display:"flex",
    flexDirection:'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%', // Ensure the gradient background spans the full width
  },
  signoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  userAvatar: {
    height: 67.5,
    width: 67.5,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 50,
  },
});
