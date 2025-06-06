type DishwasherData = {
  deviceTemperature: number;
  power: "on" | "off";
  cleaningMode: string;
  contactor: string;
  pomp1: string;
  pomp2: string;
  pomp3: string;
  heater: string;
  isDoorOpen: "open" | "closed";
  isWaterFull: "full" | "empty";
};

type DeviceData<T extends string> = T extends "dishwasher"
  ? DishwasherData
  : Record<string, never>;

const getDeviceData = <T extends string>(
  deviceType: T,
  value: string
): DeviceData<T> => {
  if (deviceType === "dishwasher") {
    const dishwasherObject = {
      deviceTemperature: Number(value.slice(0, 2)),
      power: value.slice(2, 3) === "1" ? "on" : "off",
      cleaningMode: value.slice(3, 4),
      contactor: value.slice(4, 5),
      pomp1: value.slice(5, 6),
      pomp2: value.slice(6, 7),
      pomp3: value.slice(7, 8),
      heater: value.slice(8, 9),
      isDoorOpen: value.slice(9, 10) === "1" ? "open" : "closed",
      isWaterFull: value.slice(10, 11) === "1" ? "full" : "empty",
    };
    return dishwasherObject as DeviceData<T>;
  } else {
    return {} as DeviceData<T>;
  }
};

export default getDeviceData;
