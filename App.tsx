import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import CartButton from "./src/components/CartButton";
import { CartProvider } from "./src/cart";
import { colors } from "./src/theme";
import type { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: "800" },
              contentStyle: { backgroundColor: colors.bg },
              headerRight: () => <CartButton />,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Products"
              component={ProductsScreen}
              options={({ route }) => ({ title: route.params?.categoryName ?? "All Parts" })}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={({ route }) => ({ title: route.params?.name ?? "Product" })}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: "Your Cart" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
