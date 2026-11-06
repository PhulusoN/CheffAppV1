import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  ImageSourcePropType 
} from 'react-native';
import { router } from 'expo-router';

// Extended interface supporting unique image assets per drink
interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: ImageSourcePropType; 
}

export default function DrinksScreen() {
  // Initial real drink items with unique descriptions and images
  const [drinks, setDrinks] = useState<DrinkItem[]>([
    {
      id: '1',
      name: 'Classic Mojito',
      description: 'White rum blended with fresh mint leaves, lime juice, cane sugar, and top-quality sparkling soda over crushed ice.',
      price: 85.00,
      imageUrl: require('../../assets/images/drink1.jpeg'), 
    },
    {
      id: '2',
      name: 'Long Island Iced Tea',
      description: 'A potent mix of vodka, tequila, light rum, triple sec, gin, a splash of cola, and fresh lemon juice.',
      price: 110.00,
      imageUrl: require('../../assets/images/drink2.jpeg'), 
    },
    {
      id: '3',
      name: 'Piña Colada',
      description: 'Sweet coconut cream, rich white rum, and fresh pineapple juice blended smooth until frothy and cold.',
      price: 95.00,
      imageUrl: require('../../assets/images/drink3.jpeg'), 
    },
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Add / Update
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // Filter drinks based on search query
  const filteredDrinks = drinks.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setModalVisible(true);
  };

  const handleOpenUpdate = (item: DrinkItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name || !price) return;
    const numericPrice = parseFloat(price) || 0;

    if (editingId) {
      setDrinks(prev => prev.map(d => d.id === editingId ? { ...d, name, description, price: numericPrice } : d));
    } else {
      // Default to drink1 or rotate for newly added items
      const newDrink: DrinkItem = {
        id: Date.now().toString(),
        name,
        description,
        price: numericPrice,
        imageUrl: require('../../assets/images/drink1.jpeg'),
      };
      setDrinks(prev => [...prev, newDrink]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setDrinks(prev => prev.filter(d => d.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Banner */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.saveTag} onPress={handleOpenAdd} activeOpacity={0.7}>
          <Text style={styles.saveText}>+ Add Drink</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Manage Menu</Text>
          <Text style={styles.headerSubtitle}>Drinks</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.filterContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search drink item by name..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Main List Area */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredDrinks.length === 0 ? (
          <Text style={styles.noItemsText}>No drink items found.</Text>
        ) : (
          filteredDrinks.map((item) => (
            <View key={item.id} style={styles.drinkCard}>
              <View style={styles.cardMainContent}>
                {/* Dynamically loads each unique image source bound to the item */}
                <Image 
                  source={item.imageUrl} 
                  style={styles.drinkImage}
                  resizeMode="cover"
                />
                
                <View style={styles.detailsContainer}>
                  <Text style={styles.drinkName}>{item.name}</Text>
                  <Text style={styles.drinkDescription} numberOfLines={4}>
                    {item.description}
                  </Text>
                  <Text style={styles.drinkPrice}>R {item.price.toFixed(2)}</Text>
                </View>
              </View>

              {/* Form Management Actions Panel */}
              <View style={styles.actionRowContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleOpenUpdate(item)} activeOpacity={0.8}>
                  <Text style={styles.actionButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { borderRightWidth: 0 }]} onPress={() => handleDelete(item.id)} activeOpacity={0.8}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Update Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Update Drink' : 'Add New Drink'}</Text>
            
            <TextInput style={styles.input} placeholder="Drink Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Price (e.g. 85)" placeholderTextColor="#888" keyboardType="numeric" value={price} onChangeText={setPrice} />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonTextInner}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButtonModal} onPress={handleSave}>
                <Text style={styles.buttonTextInner}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Persistent Bottom Controls Bar */}
      <View style={styles.footerNavBar}>
        <TouchableOpacity 
          style={styles.homeIconButton} 
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Text style={styles.homeIconText}>🏠</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 5 },
  saveTag: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  saveText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  headerTitleWrapper: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', textDecorationLine: 'underline' },
  headerSubtitle: { fontSize: 20, fontWeight: '600', color: '#1A237E', textDecorationLine: 'underline', marginTop: 4 },
  headerPlaceholder: { width: 50 },
  filterContainer: { paddingHorizontal: 16, marginTop: 10 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 8, backgroundColor: '#f9f9f9' },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  noItemsText: { textAlign: 'center', color: '#777', marginTop: 40, fontSize: 14 },
  drinkCard: { borderWidth: 1, borderColor: '#333333', borderRadius: 8, padding: 12, marginTop: 16, backgroundColor: '#FFFFFF' },
  cardMainContent: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  drinkImage: { width: 100, height: 100, borderRadius: 6, borderWidth: 1, borderColor: '#333333' },
  detailsContainer: { flex: 1, justifyContent: 'space-between' },
  drinkName: { fontSize: 16, fontWeight: 'bold', color: '#000000' },
  drinkDescription: { fontSize: 11, color: '#444444', lineHeight: 14, marginVertical: 4 },
  drinkPrice: { fontSize: 14, fontWeight: 'bold', color: '#000000', textAlign: 'right' },
  actionRowContainer: { flexDirection: 'row', backgroundColor: '#FF0000', borderRadius: 4, padding: 2 },
  actionButton: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRightWidth: 1, borderRightColor: '#FFFFFF' },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  footerNavBar: { backgroundColor: '#FF0000', paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  homeIconButton: { paddingHorizontal: 20 },
  homeIconText: { fontSize: 22, color: '#FFFFFF' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  cancelButton: { flex: 1, backgroundColor: '#888', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveButtonModal: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonTextInner: { color: '#fff', fontWeight: 'bold' }
});