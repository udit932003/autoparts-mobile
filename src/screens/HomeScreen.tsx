import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SvgImage from "../components/SvgImage";
import ProductCard from "../components/ProductCard";
import CartButton from "../components/CartButton";
import { fetchCategories, fetchProducts } from "../api";
import { colors } from "../theme";
import type { Category, Product, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError("");
      const [cats, feat] = await Promise.all([
        fetchCategories(),
        fetchProducts({ featured: true }),
      ]);
      setCategories(cats);
      setFeatured(feat);
    } catch {
      setError("Couldn't reach the server. Check API_BASE_URL in src/config.ts and that the website is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>🔧</Text>
            </View>
            <Text style={styles.logoText}>
              AutoParts<Text style={{ color: colors.brand }}>Hub</Text>
            </Text>
          </View>
          <CartButton />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>🚗 100% Genuine Parts</Text>
          <Text style={styles.heroTitle}>Quality car parts, delivered fast.</Text>
          <Text style={styles.heroSub}>
            From brake pads to batteries — find the right part for your car at unbeatable prices.
          </Text>
          <Pressable style={styles.heroBtn} onPress={() => navigation.navigate("Products")}>
            <Text style={styles.heroBtnText}>Shop all parts →</Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <ActivityIndicator color={colors.brand} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Categories */}
            <Text style={styles.sectionTitle}>Shop by category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.catCard}
                  onPress={() => navigation.navigate("Products", { category: c.slug, categoryName: c.name })}
                >
                  {c.image ? <SvgImage path={c.image} rounded={12} /> : <View style={styles.catFallback} />}
                  <Text style={styles.catName} numberOfLines={1}>{c.name}</Text>
                  <Text style={styles.catCount}>{c.productCount} items</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Featured */}
            <View style={styles.sectionHeadRow}>
              <Text style={styles.sectionTitle}>Featured parts</Text>
              <Pressable onPress={() => navigation.navigate("Products")}>
                <Text style={styles.link}>View all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featRow}>
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  width={160}
                  onPress={() => navigation.navigate("ProductDetail", { slug: p.slug, name: p.name })}
                />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMark: { width: 34, height: 34, borderRadius: 9, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  logoMarkText: { fontSize: 16 },
  logoText: { fontSize: 18, fontWeight: "800", color: colors.text },
  hero: { margin: 16, padding: 20, borderRadius: 18, backgroundColor: colors.dark },
  heroTag: { color: "#fdba74", fontSize: 12, fontWeight: "700" },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 8, lineHeight: 32 },
  heroSub: { color: "#cbd5e1", fontSize: 13, marginTop: 8, lineHeight: 19 },
  heroBtn: { backgroundColor: colors.brand, alignSelf: "flex-start", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 999, marginTop: 16 },
  heroBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text, paddingHorizontal: 16, marginTop: 10 },
  sectionHeadRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 16, marginTop: 18 },
  link: { color: colors.brand, fontWeight: "700", fontSize: 13 },
  catRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  catCard: { width: 110 },
  catFallback: { width: "100%", aspectRatio: 1, borderRadius: 12, backgroundColor: colors.border },
  catName: { fontSize: 12, fontWeight: "700", color: colors.text, marginTop: 6 },
  catCount: { fontSize: 11, color: colors.textMuted },
  featRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  errorBox: { margin: 16, padding: 16, borderRadius: 12, backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fecaca" },
  errorText: { color: "#b91c1c", fontSize: 13, lineHeight: 19 },
  retryBtn: { alignSelf: "flex-start", marginTop: 10, backgroundColor: colors.red, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
});
