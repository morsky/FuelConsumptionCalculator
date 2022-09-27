import { Vehicle } from "../models/vehicle";
import { insertVehicleData } from "./database";

export async function addData() {
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-01"));
  await insertVehicleData(new Vehicle("123123", 2.54, "2022-08-02"));
  await insertVehicleData(new Vehicle("123123", 2.84, "2022-08-03"));
  await insertVehicleData(new Vehicle("123123", 2.24, "2022-08-04"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-05"));
  await insertVehicleData(new Vehicle("123123", 2.64, "2022-08-06"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-07"));
  await insertVehicleData(new Vehicle("123123", 2.54, "2022-08-08"));
  await insertVehicleData(new Vehicle("123123", 2.44, "2022-08-09"));
  await insertVehicleData(new Vehicle("123123", 2.64, "2022-08-10"));
  await insertVehicleData(new Vehicle("123123", 2.84, "2022-08-11"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-12"));
  await insertVehicleData(new Vehicle("123123", 2.94, "2022-08-13"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-14"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-15"));
  await insertVehicleData(new Vehicle("123123", 2.84, "2022-08-16"));
  await insertVehicleData(new Vehicle("123123", 2.04, "2022-08-17"));
  await insertVehicleData(new Vehicle("123123", 2.24, "2022-08-18"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-19"));
  await insertVehicleData(new Vehicle("123123", 2.54, "2022-08-20"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-21"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-22"));
  await insertVehicleData(new Vehicle("123123", 2.64, "2022-08-23"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-24"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-25"));
  await insertVehicleData(new Vehicle("123123", 2.74, "2022-08-26"));
  await insertVehicleData(new Vehicle("123123", 2.64, "2022-08-27"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-28"));
  await insertVehicleData(new Vehicle("123123", 2.34, "2022-08-29"));
  await insertVehicleData(new Vehicle("123123", 2.84, "2022-08-30"));
  await insertVehicleData(new Vehicle("123123", 2.84, "2022-08-31"));
}
