import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { telUrl, whatsappUrl } from "../contact";

// Floating WhatsApp + Call buttons (lead to the sales person) — mirrors the website.
export default function FloatingContact() {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        style={[styles.btn, { backgroundColor: "#25D366" }]}
        onPress={() => Linking.openURL(whatsappUrl("Hi! I have a question about car parts."))}
      >
        <Text style={styles.icon}>💬</Text>
      </Pressable>
      <Pressable
        style={[styles.btn, { backgroundColor: "#ea580c" }]}
        onPress={() => Linking.openURL(telUrl())}
      >
        <Text style={styles.icon}>📞</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", right: 16, bottom: 24, gap: 12, alignItems: "center" },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  icon: { fontSize: 26 },
});
