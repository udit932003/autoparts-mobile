import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../api";
import { colors } from "../theme";
import type { Category, Product, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Products">;

export default function ProductsScreen({ navigation, route }: Props) {
  const initialCategory = route.params?.category;
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | undefined>(initialCategory);
  const [query, setQuery] = useState(route.params?.q ?? "");
  const [search, setSearch] = useState(route.params?.q ?? "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchProducts({ q: search || undefined, category: activeCat });
      setProducts(list);
    } catch {
      setError("Couldn't load products. Is the website running and API_BASE_URL set?");
    } finally {
      setLoading(false);
    }
  }, [search, activeCat]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => setSearch(query.trim())}
          returnKeyType="search"
          placeholder="Search parts, brands..."
          placeholderTextColor={colors.textMuted}
          style={styles.search}
        />
        {query.length > 0 && (
          <Pressable onPress={() => { setQuery(""); setSearch(""); }} style={styles.clearBtn}>
            <Text style={{ color: colors.textMuted, fontWeight: "700" }}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Category chips */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" active={!activeCat} onPress={() => setActiveCat(undefined)} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} active={activeCat === c.slug} onPress={() => setActiveCat(c.slug)} />
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.brand} size="large" style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={load}><Text style={styles.retryText}>Retry</Text></Pressable>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No products found</Text>
          <Text style={styles.emptySub}>Try a different search or category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
          contentContainerStyle={{ gap: 12, paddingVertical: 12, paddingBottom: 28 }}
          ListHeaderComponent={
            <Text style={styles.countText}>{products.length} products</Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetail", { slug: item.slug, name: item.name })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { paddingHorizontal: 16, paddingTop: 10, justifyContent: "center" },
  search: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.text },
  clearBtn: { position: "absolute", right: 28, top: 20, padding: 6 },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  chipTextActive: { color: "#fff" },
  countText: { paddingHorizontal: 16, paddingBottom: 4, color: colors.textMuted, fontSize: 13 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  empty: { fontSize: 16, fontWeight: "700", color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  errorText: { color: "#b91c1c", fontSize: 13, textAlign: "center", lineHeight: 19 },
  retryBtn: { marginTop: 12, backgroundColor: colors.red, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
});
