import { StyleSheet, Text } from 'react-native';
import { useTheme } from "../theme/themeContext";

type TextAuthPageProps = {
  txt: string;
};

export default function TextAuthPage({ txt }: TextAuthPageProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: theme.fontSize.large,
          color: theme.colors.text,
        },
      ]}
    >
      {txt}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});
