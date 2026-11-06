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

type Course = 'Starter' | 'Main Course' | 'Dessert';

interface MealItem {
  id: string;
  course: Course;
  name: string;
  description: string;
  price: number;
  imageUrl: ImageSourcePropType;
}

export default function MealsScreen() {
  const [mealItems, setMealItems] = useState<MealItem[]>([
    {
      id: '1',
      course: 'Starter',
      name: 'Crispy Garlic Prawns',
      description: 'Juicy tiger prawns sautéed in garlic butter, chili flakes, and fresh lemon juice, served with toasted artisanal bread.',
      price: 145.00,
      imageUrl: require('@/assets/images/pork.jpeg'), 
    },
    {
      id: '2',
      course: 'Main Course',
      name: 'The Ultimate Tomahawk Steak',
      description: '800g prime matured rib-eye steak flame grilled with rosemary, garlic, and butter, served with crispy sweet potato chips.',
      price: 450.25,
      imageUrl: require('@/assets/images/steak.jpeg'),
    },
    {
      id: '3',
      course: 'Dessert',
      name: 'Molten Lava Chocolate Cake',
      description: 'Decadent rich chocolate cake with a warm, gooey molten center, served with a scoop of vanilla bean ice cream.',
      price: 95.99,
      imageUrl: require('@/assets/images/CAKE.jpeg'),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | 'All'>('All');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Starter');
  const [price, setPrice] = useState('');

  const filteredItems = mealItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'All' || item.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCourse('Starter');
    setPrice('');
    setModalVisible(true);
  };

  const handleOpenUpdate = (item: MealItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name || !price) return;
    const numericPrice = parseFloat(price) || 0;

    if (editingId) {
      setMealItems(prev => prev.map(m => m.id === editingId ? { ...m, name, description, course, price: numericPrice } : m));
    } else {
      const newMeal: MealItem = {
        id: Date.now().toString(),
        course,
        name,
        description,
        price: numericPrice,
        imageUrl: require('@/assets/images/pork.jpeg'),
      };
      setMealItems(prev => [...prev, newMeal]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setMealItems(prev => prev.filter(m => m.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.saveTag} onPress={handleOpenAdd} activeOpacity={0.7}>
          <Text style={styles.saveText}>+ Add Meal</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Manage Menu</Text>
          <Text style={styles.headerSubtitle}>Meals</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.filterContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search menu item by name..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseFilterRow}>
          {['All', 'Starter', 'Main Course', 'Dessert'].map((c) => (
            <TouchableOpacity 
              key={c} 
              style={[styles.filterChip, selectedCourse === c && styles.activeFilterChip]}
              onPress={() => setSelectedCourse(c as any)}
            >
              <Text style={[styles.filterChipText, selectedCourse === c && styles.activeFilterChipText]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>No meal items found matching criteria.</Text>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} style={styles.mealCard}>
              <Text style={styles.courseTitle}>{item.course}</Text>
              
              <View style={styles.cardMainContent}>
                <Image 
                  source={item.imageUrl} 
                  style={styles.foodImage}
                  resizeMode="cover"
                /> 
                
                <View style={styles.detailsContainer}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodDescription} numberOfLines={4}>
                    {item.description}
                  </Text>
                  <Text style={styles.foodPrice}>R {item.price.toFixed(2)}</Text>
                </View>
              </View>

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

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Update Meal' : 'Add New Meal'}</Text>
            
            <TextInput style={styles.input} placeholder="Meal Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Price (e.g. 150)" placeholderTextColor="#888" keyboardType="numeric" value={price} onChangeText={setPrice} />
            
            <Text style={styles.label}>Select Course:</Text>
            <View style={styles.courseSelectRow}>
              {(['Starter', 'Main Course', 'Dessert'] as Course[]).map((c) => (
                <TouchableOpacity 
                  key={c} 
                  style={[styles.courseOption, course === c && styles.selectedCourseOption]}
                  onPress={() => setCourse(c)}
                >
                  <Text style={[styles.courseOptionText, course === c && styles.selectedCourseOptionText]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

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
  courseFilterRow: { flexDirection: 'row', marginBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 16, marginRight: 8 },
  activeFilterChip: { backgroundColor: '#D32F2F' },
  filterChipText: { fontSize: 12, color: '#333' },
  activeFilterChipText: { color: '#fff', fontWeight: 'bold' },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  noItemsText: { textAlign: 'center', color: '#777', marginTop: 40, fontSize: 14 },
  mealCard: { borderWidth: 1, borderColor: '#333333', borderRadius: 8, padding: 12, marginTop: 12, backgroundColor: '#FFFFFF' },
  courseTitle: { fontSize: 14, fontWeight: '700', color: '#333333', textDecorationLine: 'underline', marginBottom: 8 },
  cardMainContent: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  foodImage: { width: 100, height: 100, borderRadius: 6, borderWidth: 1, borderColor: '#333333' },
  detailsContainer: { flex: 1, justifyContent: 'space-between' },
  foodName: { fontSize: 16, fontWeight: 'bold', color: '#000000' },
  foodDescription: { fontSize: 11, color: '#444444', lineHeight: 14, marginVertical: 4 },
  foodPrice: { fontSize: 14, fontWeight: 'bold', color: '#000000', textAlign: 'right' },
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
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  courseSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  courseOption: { flex: 1, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', marginHorizontal: 4, borderRadius: 6 },
  selectedCourseOption: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  courseOptionText: { fontSize: 12, color: '#333' },
  selectedCourseOptionText: { color: '#fff', fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, backgroundColor: '#888', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveButtonModal: { flex: 1, backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonTextInner: { color: '#fff', fontWeight: 'bold' }
});