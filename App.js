import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import FavoritesScreen from './FavoritesScreen';
import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';

import { ThemeContext } from './ThemeContext';
import { lightColors, darkColors } from './styles';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack({ navigation: parentNav, books, setBooks, theme }) {
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerLeft: ({ tintColor }) => (
          <TouchableOpacity onPress={() => parentNav?.getParent()?.openDrawer()} style={{ paddingLeft: 12 }}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        )
      }}>
      <Stack.Screen name="HomeList" options={{ title: "My Books" }}>
        {(props) => <HomeScreen {...props} books={books} setBooks={setBooks} theme={theme} />}
      </Stack.Screen>
      <Stack.Screen name="Details" options={{ title: "Details" }}>
        {(props) => <DetailsScreen {...props} books={books} setBooks={setBooks} theme={theme} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function getIconName(routeName, focused) {
  if (routeName === 'Home') return focused ? 'home' : 'home-outline';
  if (routeName === 'Favorites') return focused ? 'heart' : 'heart-outline';
  return 'ellipse';
}

// const Navigation = createStaticNavigation(Stack);

export default function App() {
  const [books, setBooks] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('@books').catch(() => null);
      if (raw) setBooks(JSON.parse(raw));
    })();
  }, [])

  React.useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('@books', JSON.stringify(books)).catch(() => null);
    })();
  }, [books]);

  //Theme persistence
  const [theme, setTheme] = React.useState('light');
  React.useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('@theme').catch(() => null);
      if (savedTheme) {
        setTheme(savedTheme);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      await AsyncStorage.setItem('@theme', theme).catch(() => null);
    })();
  }, [theme]);

  // derive palette and navigation theme once
  const palette = theme === 'dark' ? darkColors : lightColors;
  const navTheme = {
    ...((theme === 'dark') ? DarkTheme : DefaultTheme),
    colors: {
      ...((theme === 'dark') ? DarkTheme.colors : DefaultTheme.colors),
      primary: palette.primary,
      background: palette.background,
      card: palette.card,
      text: palette.text,
      border: palette.card,
      notification: palette.accent,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>

        <NavigationContainer theme={navTheme}>
          <Drawer.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerShown: false,
              drawerPosition: 'left',
              drawerStyle: { width: '70%' },
              overlayColor: 'rgba(0,0,0,0.35)',
            }}
          >
            <Drawer.Screen name="Main">
              {() => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                    tabBarActiveTintColor: navTheme.colors.primary,
                    tabBarInactiveTintColor: navTheme.colors.text,
                    tabBarStyle: { backgroundColor: navTheme.colors.card },
                    tabBarIcon: ({ focused, color, size }) => (
                      <Ionicons name={getIconName(route.name, focused)} size={size} color={color} />
                    ),
                  })}
                >
                  <Tab.Screen name="Home">
                    {(props) => <HomeStack {...props} books={books} setBooks={setBooks} theme={theme} />}
                  </Tab.Screen>
                  <Tab.Screen name="Favorites" options={{ headerShown: true }}>
                    {(props) => <FavoritesScreen {...props} books={books} setBooks={setBooks} theme={theme} />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Drawer.Screen>
            <Drawer.Screen
              name="Settings"
              options={{
                headerShown: true,                // override: show header for this screen
                headerTitleAlign: 'center',
                title: 'Settings',
                headerStyle: { backgroundColor: palette.card },
                headerTintColor: palette.text,
              }}>
              {(props) => <SettingsScreen {...props} theme={theme} setTheme={setTheme} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="About"
              options={{
                headerShown: true,
                headerTitleAlign: 'center',
                title: 'About',
                headerStyle: { backgroundColor: palette.card },
                headerTintColor: palette.text,
              }}>
              {(props) => <AboutScreen {...props} />}
            </Drawer.Screen>
          </Drawer.Navigator>

          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        </NavigationContainer>

      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}

