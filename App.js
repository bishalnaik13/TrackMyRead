import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

function HomeScreen(){
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  )
}
function FavoritesScreen(){
  return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Favorites Screen</Text>
    </View>
  )
}
const Tab = createBottomTabNavigator();

function getIconName(routeName, focused){
  if( routeName === 'Home') return focused ? 'home' : 'home-outline';
  if( routeName === 'Favorites') return focused? 'heart' : 'heart-outline';
  return 'ellipse';
}

// const Navigation = createStaticNavigation(Stack);

export default function App() {
  return (
    // <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            tabBarIcon: ({ focused, color, size}) => (
              <Ionicons name = {getIconName(route.name, focused)} size={size} color={color}/>
            ),
          })}
          >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
      // {/* <Navigation /> */}
      // {/* <Text>Helloo!</Text> */}
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
