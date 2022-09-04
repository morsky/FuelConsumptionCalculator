import * as SQLite from "expo-sqlite";

import { Vehicle } from "../models/vehicle";

const database = SQLite.openDatabase("fuel_consumption.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS fuel_consumption (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            consumption REAL NOT NULL,
            date TEXT NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function insertVehicleData(vehicle) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO fuel_consumption (name, consumption, date) VALUES (?, ?, ?)`,
        [vehicle.name, vehicle.consumption, vehicle.date],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function getVehicleNames() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT DISTINCT name FROM fuel_consumption`,
        [],
        (_, result) => {
          const items = [];

          for (const dp of result.rows._array) {
            items.push(dp.name);
          }

          resolve(items);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function updateVehicleName(oldName, newName) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE fuel_consumption SET name = (?) WHERE name LIKE (?)`,
        [newName, oldName],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function deleteVehicle(name) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM fuel_consumption WHERE name LIKE (?)`,
        [name],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
