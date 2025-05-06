import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/themeContext";

type BtnProps = {
  txt: string;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
};

export default function Button({ txt, onPress, active, disabled }: BtnProps) {
  const theme = useTheme();

  const backgroundColor = active ? theme.colors.primary : theme.colors.white;
  const textColor = theme.colors.text;

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
      ]}
    >
      <Text style={[styles.text, { color: theme.colors.primary }]}>{txt}</Text>
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
