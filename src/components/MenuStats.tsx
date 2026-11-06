import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMenu, Course } from '../context/MenuContext';

const COURSES: Course[] = ['Starter', 'Main Course', 'Dessert'];

export default function MenuStats() {
  const { items } = useMenu();

  const stats = useMemo(() => {
    const total = items.length;
    const average =
      total === 0 ? 0 : items.reduce((sum, i) => sum + i.price, 0) / total;

    const perCourse = COURSES.map(c => {
      const inCourse = items.filter(i => i.course === c);
      return {
        course: c,
        count: inCourse.length,
        average:
          inCourse.length === 0
            ? 0
            : inCourse.reduce((s, i) => s + i.price, 0) / inCourse.length,
      };
    });

    return { total, average, perCourse };
  }, [items]);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Menu Overview</Text>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.value}>{stats.total}</Text>
          <Text style={styles.label}>Items available</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.value}>R{stats.average.toFixed(2)}</Text>
          <Text style={styles.label}>Average price</Text>
        </View>
      </View>

      <Text style={styles.subheading}>By course</Text>
      {stats.perCourse.map(p => (
        <View key={p.course} style={styles.courseRow}>
          <Text style={styles.courseName}>{p.course}</Text>
          <Text style={styles.courseInfo}>
            {p.count} {p.count === 1 ? 'item' : 'items'}
            {p.count > 0 ? `  •  avg R${p.average.toFixed(2)}` : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  box: {
    flex: 1,
    backgroundColor: '#f7f3e8',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  value: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 12, color: '#666', marginTop: 4 },
  subheading: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  courseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  courseName: { fontSize: 14 },
  courseInfo: { fontSize: 14, color: '#555' },
});
