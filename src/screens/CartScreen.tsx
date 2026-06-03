import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SvgImage from "../components/SvgImage";
import { useCart } from "../cart";
import { colors, formatPrice } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export default function CartScreen({ navigation }: Props) {
  const { items, removeItem, setQuantity, totalPrice, totalItems, clear } = useCart();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Browse parts and add them to your cart.</Text>
          <Pressable style={styles.shopBtn} onPress={() => navigation.navigate("Products")}>
            <Text style={styles.shopBtnText}>Shop parts</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const shipping = totalPrice >= 2000 ? 0 : 199;
  const grand = totalPrice + shipping;

  function checkout() {
    Alert.alert("Order placed! 🎉", "Thank you for your order.\n(This is a demo checkout.)", [
      { text: "OK", onPress: () => { clear(); navigation.navigate("Home"); } },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text style={styles.count}>{totalItems} item(s)</Text>

        {items.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.thumb}>
              <SvgImage path={item.image} rounded={10} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{item.brand.toUpperCase()}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>

              <View style={styles.qtyRow}>
                <View style={styles.stepper}>
                  <Pressable onPress={() => setQuantity(item.id, item.quantity - 1)} style={styles.stepBtn}>
                    <Text style={styles.stepText}>−</Text>
                  </Pressable>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <Pressable onPress={() => setQuantity(item.id, item.quantity + 1)} style={styles.stepBtn}>
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <Row label="Subtotal" value={formatPrice(totalPrice)} />
          <Row label="Shipping" value={shipping === 0 ? "FREE" : formatPrice(shipping)} />
          {shipping > 0 && (
            <Text style={styles.shipHint}>Add {formatPrice(2000 - totalPrice)} more for free shipping</Text>
          )}
          <View style={styles.divider} />
          <Row label="Total" value={formatPrice(grand)} bold />
        </View>
      </ScrollView>

      <View style={styles.bar}>
        <View>
          <Text style={styles.barLabel}>Total</Text>
          <Text style={styles.barTotal}>{formatPrice(grand)}</Text>
        </View>
        <Pressable style={styles.checkoutBtn} onPress={checkout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.sumRow}>
      <Text style={[styles.sumLabel, bold && styles.sumBold]}>{label}</Text>
      <Text style={[styles.sumValue, bold && styles.sumBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  count: { color: colors.textMuted, fontSize: 13, marginBottom: 10 },
  row: { flexDirection: "row", gap: 12, backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 10, marginBottom: 10 },
  thumb: { width: 76 },
  brand: { color: colors.brand, fontSize: 10, fontWeight: "700" },
  name: { color: colors.text, fontSize: 13, fontWeight: "600", marginTop: 2 },
  price: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  stepper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: 8 },
  stepBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  stepText: { fontSize: 18, color: colors.text, fontWeight: "700" },
  qty: { width: 28, textAlign: "center", fontWeight: "700", color: colors.text },
  remove: { color: colors.red, fontSize: 13, fontWeight: "600" },
  lineTotal: { fontWeight: "800", color: colors.text },
  summary: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginTop: 6 },
  sumRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  sumLabel: { color: colors.textMuted, fontSize: 14 },
  sumValue: { color: colors.text, fontSize: 14, fontWeight: "600" },
  sumBold: { fontWeight: "800", fontSize: 17, color: colors.text },
  shipHint: { color: colors.amber, fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, paddingBottom: 24, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  barLabel: { fontSize: 11, color: colors.textMuted },
  barTotal: { fontSize: 18, fontWeight: "800", color: colors.text },
  checkoutBtn: { backgroundColor: colors.brand, paddingHorizontal: 32, paddingVertical: 13, borderRadius: 999 },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 12 },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: "center" },
  shopBtn: { marginTop: 18, backgroundColor: colors.brand, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 },
  shopBtnText: { color: "#fff", fontWeight: "700" },
});
