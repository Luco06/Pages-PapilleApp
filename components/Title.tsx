import { StyleSheet, Text } from 'react-native';
import { useTheme } from "../theme/themeContext";

type TitleProps = {
    title: string
}

export default function Title({title}: TitleProps) {
  const theme = useTheme()
  return (

      <Text style={[
        styles.text,{
          fontSize: theme.fontSize.title,
          color: theme.colors.primary
        }
      ]}>{title}</Text>
  
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  }
})