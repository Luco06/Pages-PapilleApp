import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Switch } from "react-native-paper";
import { useTheme } from "../theme/themeContext";

type SwitchProp = {
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export default function SwitchComponent({
  value,
  label,
  onChange,
  style
}: SwitchProp) {
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
      <Switch
        trackColor={{
          false: theme.colors.switchTrack,
          true: theme.colors.switchActiveTrack,
        }}
        thumbColor={
          value ? theme.colors.switchActiveThumb : theme.colors.switchThumb
        }
        onValueChange={onChange}
        color={theme.colors.primary}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  constainer:{
    display:"flex"
  },
  wrapper: {
    width: "60%",
  },
  label: {

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
