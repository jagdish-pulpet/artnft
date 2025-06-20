
// react-native-app/src/navigation/MainTabNavigator.tsx
// Placeholder for a Tab Navigator (e.g., Home, Collections, Create, Profile)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Assuming this is your main app stack root
import CollectionListScreen from '../screens/CollectionListScreen';
import CreateNftScreen from '../screens/CreateNftScreen'; // Or a dedicated "Create" hub screen
import ProfileScreen from '../screens/ProfileScreen';
import { theme } from '../styles/theme';

// Import icons from a library like react-native-vector-icons or use SVGs/custom components
// For example, using placeholder text for icons:
// import { HomeIcon, CollectionIcon, PlusCircleIcon, UserIcon } from 'lucide-react-native'; // If using lucide-react-native
import { Text } from 'react-native'; 
const IconPlaceholder = ({ name, color, size }: {name:string, color:string, size:number}) => <Text style={{color, fontSize: size/2}}>{name.substring(0,1)}</Text>;


export type MainTabParamList = {
  HomeTab: undefined; // Refers to the Home screen/stack
  CollectionsTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'Home';
          else if (route.name === 'CollectionsTab') iconName = 'Grid';
          else if (route.name === 'CreateTab') iconName = 'Plus';
          else if (route.name === 'ProfileTab') iconName = 'User';
          else iconName = '?';
          // return <ActualIconComponent name={iconName} size={size} color={color} />;
          return <IconPlaceholder name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: { 
            backgroundColor: theme.colors.card, 
            borderTopColor: theme.colors.border,
        },
        headerShown: false, // Often headers are managed by StackNavigators inside each tab
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="CollectionsTab" component={CollectionListScreen} options={{ title: 'Collections' }} />
      <Tab.Screen name="CreateTab" component={CreateNftScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

    