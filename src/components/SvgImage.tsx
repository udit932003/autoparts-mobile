import { View, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { imageUrl } from "../config";
import { colors } from "../theme";

// Renders the remote SVG product/category artwork served by the website.
export default function SvgImage({
  path,
  rounded = 0,
}: {
  path: string;
  rounded?: number;
}) {
  return (
    <View style={[styles.box, { borderRadius: rounded }]}>
      <SvgUri uri={imageUrl(path)} width="100%" height="100%" />
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
});
