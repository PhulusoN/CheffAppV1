import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
// 1. Import the router hook from expo-router
import { router } from 'expo-router'; 

export default function WelcomeScreen() {
   const handleLogin = () => {
    // router.replace clears the history stack or overrides 
    // the layout lock so it doesn't snap back to screen 1
    router.replace('/managemenu'); 
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerLabel}>Restaurant name</Text>
        <Text style={styles.restaurantName}>Good day Chef</Text>
      </View>

      {/* Main Illustration Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('@/assets/images/home.jpg')} 
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Footer / Action Section */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  headerLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D32F2F', 
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333333',
    textDecorationLine: 'underline',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginVertical: 20,
  },
  illustration: {
    width: '100%',
    height: 300,
  },
  footerContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FF0000', 
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
