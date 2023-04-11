import { useLayoutEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";

import Button from "../components/UI/Button";

import { Colors } from "../constants/colors";

import { Vehicle } from "../models/vehicle";

import { insertVehicleData, updateVehicleName } from "../util/database";
import { formatDate } from "../util/datetime";

import { useDispatch, useSelector } from "react-redux";
import { store } from "../store/store";
import { addVehicle, updateVehicle } from "../store/vehicleOperations";

import i18n from "i18n-js";

import { en } from "../translations/translation-en";
import { bg } from "../translations/translation-bg";

function EditDropdownItem({ navigation }) {
  const vehiche = store.getState().vehiche.vehicle;
  const oldName = vehiche.name;
  const consumption = vehiche.consumption;
  const allVehicleNames = store.getState().vehicleNames.vehicles;
  const [inputs, setInputs] = useState({
    newName: {
      value: oldName,
      isValid: true,
      message: "",
    },
  });
  const dispatch = useDispatch();
  const langulage = useSelector((state) => state.langulage)?.langulage;

  i18n.locale = langulage;
  i18n.fallbacks = true;
  i18n.translations = { en, bg };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !oldName ? i18n.t("addVehicleTitle") : i18n.t("editVehicleTitle"),
    });
  }, [navigation, oldName]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true, message: "" },
      };
    });
  }

  async function saveHandler() {
    if (!inputs.newName.value) {
      setInputs((curInputs) => {
        return {
          newName: {
            value: curInputs.newName.value,
            isValid: false,
            message: i18n.t("errorName_AddEditInputMsg"),
          },
        };
      });

      return;
    }

    if (allVehicleNames.includes(inputs.newName.value)) {
      setInputs((curInputs) => {
        return {
          newName: {
            value: curInputs.newName.value,
            isValid: false,
            message: i18n.t("errorExists_AddEditInputMsg"),
          },
        };
      });

      return;
    }

    if (!oldName) {
      const newVehicle = new Vehicle(
        inputs.newName.value,
        consumption,
        formatDate(new Date())
      );
      try {
        await insertVehicleData(newVehicle);

        dispatch(addVehicle(inputs.newName.value, newVehicle));

        Alert.alert(
          i18n.t("addVehicleAlertTitle"),
          i18n.t("addVehicleAlertText")
        );

        navigation.navigate("ConsumptionCalculator");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateVehicleName(oldName, inputs.newName.value);

        dispatch(
          updateVehicle({ oldValue: oldName, newValue: inputs.newName.value })
        );

        navigation.navigate("ListDropdownItems");
      } catch (error) {
        console.log(error);
      }
    }
  }

  const invalidFields = !inputs.newName.isValid;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, invalidFields && styles.invalidLabel]}>
        {!oldName
          ? `${i18n.t("typeVehicleName")}:`
          : `${i18n.t("renameVehicle")}:`}
      </Text>

      <TextInput
        style={[styles.input, invalidFields && styles.invalidInput]}
        onChangeText={inputChangedHandler.bind(this, "newName")}
        value={inputs.newName.value}
        placeholder={i18n.t("placeholderVehicleName")}
        // maxLength={16}
      />

      <View style={styles.errorContainer}>
        {invalidFields && (
          <Text style={[styles.errorText, invalidFields && styles.errorText]}>
            {inputs.newName.message}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={() => navigation.goBack()}>
          {i18n.t("cancelButton")}
        </Button>
        <Button onPress={saveHandler}>{i18n.t("saveButton")}</Button>
      </View>
    </View>
  );
}

export default EditDropdownItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellow100,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  input: {
    borderColor: Colors.gray700,
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  errorContainer: {
    height: 30,
    marginTop: 10,
  },
  errorText: {
    textAlign: "center",
    color: Colors.error200,
  },
  invalidLabel: {
    color: Colors.error200,
  },
  invalidInput: {
    backgroundColor: Colors.error50,
    borderColor: Colors.error300,
  },
});
