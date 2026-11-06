import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import MenuStats from '@/components/MenuStats';

export default function ManageMenuScreen() {
  
  const handleMenuSelection = () => {
    // Navigates to the 3rd screen (Meals list panel)
    router.push('/meals'); 
  };

  const handleDrinksSelection = () => {
    // Navigates to the 4th screen (Drinks list panel)
    router.push('/drinks'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Centered Red Header Label */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Manage Menu</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Menu Stats Overview Card */}
        <View style={{ width: '100%', marginTop: 24 }}>
          <MenuStats />
        </View>

        {/* Section 1: Meals / Menu Selection */}
        <View style={styles.categoryCard}>
          <Image 
            source={require('@/assets/images/menu1.jpg')}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.redButton} 
            onPress={handleMenuSelection}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Menu selection</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2: Drinks */}
        <View style={styles.categoryCard}>
          <Image 
            source={require('@/assets/images/menu2.jpg')} 
            style={styles.cardImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.redButton} 
            onPress={handleDrinksSelection}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Drinks</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F', 
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    alignItems: 'center',
  },
  categoryCard: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 16,
  },
  redButton: {
    backgroundColor: '#FF0000', 
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
