import { StyleSheet, Text, View } from "react-native";
import { Switch } from "react-native-paper";
import { useTheme } from "../theme/themeContext";

type SwitchProp = {
  value: boolean;
  label: string;
  onChange:(value:boolean)=>void;
};

export default function SwitchComponent({ value, label, onChange }: SwitchProp) {
  const theme = useTheme();
  return (
    <View>
      <Text
        style={[
          styles.label,
          { color: theme.colors.text, fontSize: theme.fontSize.small },
        ]}
      >
        {label}
      </Text>
      <Switch onValueChange={onChange} color={theme.colors.primary} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "60%",
  },
  label: {
    marginBottom: 6,
    textAlign: "center",
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  iconRight: {
    position: "absolute",
    right: 10,
    top: 13, // ajuste selon le design
  },
});
