import { Tabs } from 'expo-router';
import { uz } from '../../constants/i18n';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="orders"
        options={{ title: uz.orders, tabBarIcon: ({ color }) => <MaterialCommunityIcons name="receipt" color={color} size={20} /> }}
      />
      <Tabs.Screen
        name="tables"
        options={{ title: uz.tables, tabBarIcon: ({ color }) => <MaterialCommunityIcons name="table" color={color} size={20} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: uz.menu, tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food" color={color} size={20} /> }}
      />
      <Tabs.Screen
        name="reports"
        options={{ title: uz.reports, tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" color={color} size={20} /> }}
      />
    </Tabs>
  );
}
