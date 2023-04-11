import { View, Text, StyleSheet } from "react-native";

import Button from "../UI/Button";

import { Colors } from "../../constants/colors";

import { useSelector } from "react-redux";

import i18n from "i18n-js";

import { en } from "../../translations/translation-en";
import { bg } from "../../translations/translation-bg";

function DropdownItem({ item, onDelete, onEdit }) {
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  function editItemHandler() {
    onEdit(item);
  }

  function DeleteItemHandler() {
    onDelete(item);
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={editItemHandler}>{i18n.t("editButton")}</Button>
          <Button onPress={DeleteItemHandler}>{i18n.t("deleteButton")}</Button>
        </View>
      </View>
    </View>
  );
}

export default DropdownItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray700,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
