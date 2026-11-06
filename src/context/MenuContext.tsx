import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Course = 'Starter' | 'Main Course' | 'Dessert';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
};

type MenuContextType = {
  items: MenuItem[];
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, updates: Omit<MenuItem, 'id'>) => void;
  deleteItem: (id: string) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Initial items so the app doesn't start empty
const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    course: 'Starter',
    name: 'Pork Stir-Fry',
    description: 'A delicious chopped masterpiece cooked on an open flame with fresh lemon juices and aromatic spices, served alongside roasted baby potatoes.',
    price: 310.00,
  },
  {
    id: '2',
    course: 'Main Course',
    name: 'The Ultimate Tomahawk Steak',
    description: '800g prime matured rib-eye steak flame grilled with rosemary, garlic, and a hint of sweet vanilla, served with crispy sweet potato chips.',
    price: 450.25,
  },
  {
    id: '3',
    course: 'Dessert',
    name: 'Chocolate Cake',
    description: 'Decadent rich chocolate cake baked with crisp seasonal spices and a sweet glaze.',
    price: 285.99,
  },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  const addItem = (item: Omit<MenuItem, 'id'>) =>
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);

  const updateItem = (id: string, updates: Omit<MenuItem, 'id'>) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));

  const deleteItem = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  return (
    <MenuContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used inside MenuProvider');
  return ctx;
}