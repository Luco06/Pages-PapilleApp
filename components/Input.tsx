import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme/themeContext';

type InputProps = {
  label: string;
  value: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
};

export default function Input({ label, value, onChangeText, secureTextEntry }: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, { marginBottom: theme.spacing.xl }]}>
      <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.fontSize.small }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.colors.primary,
            color: theme.colors.text,
          },
        ]}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '80%',
  },
  label: {
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    height: 50,
  },
});
