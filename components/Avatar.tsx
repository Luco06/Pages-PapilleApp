import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/themeContext';

type AvatarProps = {
    src:{ uri: string };
    alt: string;
  };
export default function Avatar({src, alt}:AvatarProps) {
    const theme = useTheme();
  return (
    <View style={[styles.AvatarView, {borderColor: theme.colors.primary, borderWidth:1}]}>
      <Image contentFit='fill' source={src} alt={alt} style={{ width: 100, height: 100, borderRadius: 50 }}  />
    </View>
  )
}

const styles = StyleSheet.create({
    AvatarView :{
        borderRadius: 50,
        height: 102,
        width: 102,
        margin: 10,
        alignSelf:"center"

    }
})