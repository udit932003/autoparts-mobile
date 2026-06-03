import { Pressable, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCart } from "../cart";
import { colors } from "../theme";
import type { RootStackParamList } from "../types";

export default function CartButton({ tint = colors.text }: { tint?: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { totalItems } = useCart();

  return (
    <Pressable onPress={() => navigation.navigate("Cart")} style={styles.btn} hitSlop={8}>
      <Text style={[styles.icon, { color: tint }]}>🛒</Text>
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
  icon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
});
