import { ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/themeContext';

type InputProps = {
  label?: string;
  value: string;
  iconRight?: ReactElement;
  placeholder?:string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
};

export default function Input({ label, value, onChangeText, secureTextEntry, iconRight, style, placeholder }: InputProps) {
  const theme = useTheme();

  return (
    <View style={[styles.wrapper, { marginBottom: theme.spacing.xl }]}>
      <Text style={[styles.label, { color: theme.colors.text, fontSize: theme.fontSize.small }]}>
        {label}
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
        placeholder={placeholder}
          style={[
            styles.input,
            {
              borderColor: theme.colors.primary,
              color: theme.colors.text,
              paddingRight: iconRight ? 40 : 10, // pour éviter que le texte passe sous l'icône
            },
         
          ]}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          value={value}
        />
        {iconRight && <View style={[styles.iconRight,style]}>{iconRight}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '80%',
    margin:5
  },
  label: {
    marginBottom: 8,
    textAlign: 'left',
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    height: 50,
    paddingLeft: 10,
  },
  iconRight: {
    position: 'absolute',
    right: 10,
    top: 13, // ajuste selon le design
  },
});
