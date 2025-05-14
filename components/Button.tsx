import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../theme/themeContext";

type BtnProps = {
  txt: string;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ txt, onPress, active, disabled, style }: BtnProps) {
  const theme = useTheme();

  const backgroundColor = active ? theme.colors.primary : theme.colors.white;
  const textColor = active ?  theme.colors.text: theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: theme.colors.primary,
        },
        style
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{txt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  text: {
    fontWeight: "bold",
  },
});
