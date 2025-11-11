import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import FavoritesScreen from './FavoritesScreen';
import { ThemeContext } from './ThemeContext';
import { lightColors, darkColors } from './styles';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({ books, setBooks, theme }) {
  const colors = theme === 'dark' ? darkColors : lightColors;
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.text }}>
      <Stack.Screen name="HomeList" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} books={books} setBooks={setBooks} />}
      </Stack.Screen>
      <Stack.Screen name="Details" options={{ title: "Details" }}>
        {(props) => <DetailsScreen {...props} books={books} setBooks={setBooks} />}
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>

        {/* Build a nav theme from our color palette so headers and tab bar match the app theme */}
        {(() => {
          const base = theme === 'dark' ? DarkTheme : DefaultTheme;
          const palette = theme === 'dark' ? darkColors : lightColors;
          const navTheme = {
            ...base,
            colors: {
              ...base.colors,
              primary: palette.primary,
              background: palette.background,
              card: palette.card,
              text: palette.text,
              border: palette.card,
            },
          };

          return (
            <NavigationContainer theme={navTheme}>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerShown: false,
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
                <Tab.Screen name="Favorites">
                  {(props) => <FavoritesScreen {...props} books={books} setBooks={setBooks} />}
                </Tab.Screen>
              </Tab.Navigator>
              <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            </NavigationContainer>
          );
        })()}
      </ThemeContext.Provider>

    </GestureHandlerRootView>

    // {/* <Navigation /> */}
    // {/* <Text>Helloo!</Text> */}
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   AddButton: {
//     position: 'absolute',
//     right:20,
//     bottom:28,
//     backgroundColor: '#007AFF',
//     width:56,
//     height:56,
//     borderRadius:28,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.84,
//     elevation: 5,
//   }
// })
