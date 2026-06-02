import { View, Image, Platform, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { imageUrl } from "../config";
import { colors } from "../theme";

// Renders the remote SVG product/category artwork served by the website.
// - Web (browser): use a normal <Image> → the browser renders the SVG natively.
// - Native (iOS/Android via Expo Go): use react-native-svg's SvgUri.
export default function SvgImage({
  path,
  rounded = 0,
}: {
  path: string;
  rounded?: number;
}) {
  const uri = imageUrl(path);
  return (
    <View style={[styles.box, { borderRadius: rounded }]}>
      {Platform.OS === "web" ? (
        <Image source={{ uri }} style={styles.fill} resizeMode="cover" />
      ) : (
        <SvgUri uri={uri} width="100%" height="100%" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  fill: { width: "100%", height: "100%" },
});
