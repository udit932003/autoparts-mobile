import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SvgImage from "../components/SvgImage";
import ProductCard from "../components/ProductCard";
import { fetchProduct } from "../api";
import { colors, formatPrice } from "../theme";
import type { Product, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ navigation, route }: Props) {
  const { slug } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProduct(slug);
      setProduct(data.product);
      setRelated(data.related);
    } catch {
      setError("Couldn't load this product.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Not found"}</Text>
        <Pressable style={styles.retryBtn} onPress={load}><Text style={styles.retryText}>Retry</Text></Pressable>
      </View>
    );
  }

  const inStock = product.stock > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageWrap}>
          <SvgImage path={product.image} />
        </View>

        <View style={styles.body}>
          <Text style={styles.brand}>{product.brand.toUpperCase()}</Text>
          <Text style={styles.name}>{product.name}</Text>
          {product.partNumber && <Text style={styles.part}>Part No: {product.partNumber}</Text>}

          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={[styles.stock, { color: inStock ? colors.green : colors.red }]}>
            {inStock ? `● In stock (${product.stock} available)` : "● Out of stock"}
          </Text>

          <Text style={styles.descHead}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoRow}>🚚  Free delivery on orders over ₹2000</Text>
            <Text style={styles.infoRow}>🛡️  100% genuine — manufacturer warranty</Text>
            <Text style={styles.infoRow}>📦  Easy 7-day returns</Text>
          </View>

          {related.length > 0 && (
            <>
              <Text style={styles.relatedHead}>Related parts</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    width={150}
                    onPress={() => navigation.push("ProductDetail", { slug: p.slug, name: p.name })}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky add-to-cart bar (demo) */}
      <View style={styles.bar}>
        <View>
          <Text style={styles.barLabel}>Price</Text>
          <Text style={styles.barPrice}>{formatPrice(product.price)}</Text>
        </View>
        <Pressable
          style={[styles.addBtn, !inStock && styles.addBtnDisabled]}
          disabled={!inStock}
          onPress={() => Alert.alert("Added to cart", `${product.name} added.\n(Cart is a demo in this app.)`)}
        >
          <Text style={styles.addBtnText}>{inStock ? "Add to cart" : "Out of stock"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.bg },
  imageWrap: { backgroundColor: colors.card, padding: 24 },
  body: { padding: 16 },
  brand: { color: colors.brand, fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  name: { color: colors.text, fontSize: 22, fontWeight: "800", marginTop: 4, lineHeight: 28 },
  part: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  price: { color: colors.text, fontSize: 28, fontWeight: "800", marginTop: 14 },
  stock: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  descHead: { fontSize: 15, fontWeight: "700", color: colors.text, marginTop: 18 },
  desc: { fontSize: 14, color: colors.textMuted, lineHeight: 21, marginTop: 6 },
  infoBox: { marginTop: 18, padding: 14, borderRadius: 12, backgroundColor: colors.brandLight, gap: 8 },
  infoRow: { fontSize: 13, color: "#7c2d12" },
  relatedHead: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: 24, marginBottom: 10 },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, paddingBottom: 24, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  barLabel: { fontSize: 11, color: colors.textMuted },
  barPrice: { fontSize: 18, fontWeight: "800", color: colors.text },
  addBtn: { backgroundColor: colors.brand, paddingHorizontal: 28, paddingVertical: 13, borderRadius: 999 },
  addBtnDisabled: { backgroundColor: colors.textMuted },
  addBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  retryBtn: { marginTop: 12, backgroundColor: colors.red, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
  errorText: { color: "#b91c1c", fontSize: 14 },
});
