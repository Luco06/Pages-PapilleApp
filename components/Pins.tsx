import { StyleSheet, View } from "react-native";
import Button from "./Button";

type PinsProps = {
  onSelectCategory: (category: string) => void;
  selectedCategory: string | null;
};
const Categories = [
  { id: 1, txt: "Viande" },
  { id: 2, txt: "Poisson" },
  { id: 3, txt: "Végétarien" },
  { id: 4, txt: "Dessert" },
  { id: 5, txt: "Boissons" },
  { id: 6, txt: "Sauces" },
];
export default function Pins({
  onSelectCategory,
  selectedCategory,
}: PinsProps) {
  return (
    <View style={styles.ContainerCate}>
      {Categories.map((categories) => (
        <Button
          key={categories.id}
          txt={categories.txt}
          onPress={() => onSelectCategory(categories.txt)}
          active={selectedCategory === categories.txt}
          style={{ width: "40%", margin: 3}}
        />
      ))}

    </View>
  );
}

const styles  = StyleSheet.create({
    ContainerCate : {
        flexDirection :"row",
     flexWrap:"wrap",
    justifyContent:"space-between"
    }
})