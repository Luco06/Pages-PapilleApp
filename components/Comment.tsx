import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/themeContext";

type CommentProps = {
  contenu: string;
  avatar: string;
  prenom: string;
  date: string;
};

export default function Comment({
  contenu,
  avatar,
  prenom,
  date,
}: CommentProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.CommentContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.HeaderRow}>
        <View
          style={[styles.AvatarWrapper, { borderColor: theme.colors.primary }]}
        >
          <Image contentFit="cover"  source={{ uri: avatar }} style={styles.Avatar} />
        </View>
        <Text style={[styles.PrenomText, { color: theme.colors.text }]}>
          {prenom}
        </Text>
      </View>
      <View style={styles.ContentContainer}>
        <Text style={[styles.CommentText, { color: theme.colors.text }]}>
          {contenu}
        </Text>
        <Text style={[styles.DateText, { color: theme.colors.text }]}>
          {" "}
          {date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CommentContainer: {
    flexDirection: "column",
    width: "70%",
    elevation: 3,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    margin: 8,
    padding: 8,
  },
  HeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  AvatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  Avatar: {
    width: 40,
    height: 40,
  },
  PrenomText: {
    fontSize: 16,
  },
  ContentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  CommentText: {
    marginTop: 8,
  },
  DateText: {
    fontSize: 12,
    marginTop: 4,
  },
});
