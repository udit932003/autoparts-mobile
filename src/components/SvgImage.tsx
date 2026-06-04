import { View, Image, StyleSheet } from "react-native";
import { imageUrl } from "../config";
import { colors } from "../theme";

// Renders remote product/category photos (JPEG) from the website.
// Works on web and native via React Native's Image.
export default function SvgImage({
  path,
  rounded = 0,
}: {
  path: string;
  rounded?: number;
}) {
  return (
    <View style={[styles.box, { borderRadius: rounded }]}>
      <Image source={{ uri: imageUrl(path) }} style={styles.fill} resizeMode="cover" />
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
