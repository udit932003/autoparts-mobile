import { View, Text, Pressable, StyleSheet } from "react-native";
import SvgImage from "./SvgImage";
import { colors, formatPrice } from "../theme";
import type { Product } from "../types";

export default function ProductCard({
  product,
  onPress,
  width,
}: {
  product: Product;
  onPress: () => void;
  width?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, width ? { width } : { flex: 1 }, pressed && styles.pressed]}
    >
      <SvgImage path={product.image} />
      {product.stock === 0 && (
        <View style={[styles.badge, { backgroundColor: colors.red }]}>
          <Text style={styles.badgeText}>Out of stock</Text>
        </View>
      )}
      {product.stock > 0 && product.stock <= 10 && (
        <View style={[styles.badge, { backgroundColor: colors.amber }]}>
          <Text style={styles.badgeText}>Only {product.stock} left</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  pressed: { opacity: 0.85 },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  body: { padding: 10 },
  brand: { color: colors.brand, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  name: { color: colors.text, fontSize: 13, fontWeight: "600", marginTop: 2, minHeight: 34 },
  price: { color: colors.text, fontSize: 16, fontWeight: "800", marginTop: 4 },
});
