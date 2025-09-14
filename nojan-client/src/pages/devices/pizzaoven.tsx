import logo from "@/../public/images/logo.png";
import pizzaovenBack from "@/../public/images/pizzaovenBack.png";
import Layout from "@/components/layout";
import Switch from "@/components/switch";
import TimeSelector from "@/components/timeSelector";
import useDeviceSocket from "@/hooks/useDeviceSocket";
import getDeviceData from "@/utils/getDeviceData";
import {
  convertNumberToTime,
  convertTimeStringToNumber,
} from "@/utils/timeConverter";
import { Button } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const availbeTimes = [
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
];

const Dishwasher = () => {
  const [isTempInputVisible, setIsTempInputVisible] = useState(false);
  const [requestedTemp, setRequestedTemp] = useState<string | null>(null);
  const [requestedCleaningMode, setRequestedCleaningMode] = useState<
    string | null
  >(null);
  const [tempInput, setTempInput] = useState("");
  const [tempLock, setTempLock] = useState(false);

  const {
    turnOnTheDevice,
    changeCleaningMode,
    changeTemperature,
    deviceState,
    turnOfTheDevice,
    loading,
    changeTime,
    turnOnTheTorch,
    turnOfTheTorch,
    isConnected,
    isConnecting,
    manualReconnect,
  } = useDeviceSocket("pizzaoven");

  const dishwasherState = getDeviceData("pizzaoven", deviceState);
  const [requestedTime, setRequestedTime] = useState("");

  const handleChangeTime = (time: string) => {
    changeTime(convertTimeStringToNumber(time));
    setRequestedTime(time);
    toast.success(`دستور تغییر زمان پخت به ${time} ارسال شد`);
  };

  useEffect(() => {
    if (
      dishwasherState.deviceTemperature &&
      dishwasherState.deviceTemperature > 0 &&
      !tempLock
    ) {
      setTempInput(dishwasherState.deviceTemperature + "");
      setTempLock(true);
    }
  }, [dishwasherState.deviceTemperature]);

  const handlePowerOn = () => {
    turnOnTheDevice();
    toast.success("دستور روشن کردن دستگاه ارسال شد");
  };

  const handlePowerOff = () => {
    turnOfTheDevice();
    toast.success("دستور خاموش کردن دستگاه ارسال شد");
  };

  const handleChangeTorch = (value: string) => {
    value === "on" ? turnOnTheTorch() : turnOfTheTorch();
    toast.success(
      `دستور تغییر وضعیت مشعل به ${value === "on" ? "روشن" : "خاموش"} ارسال شد`
    );
  };

  const handleTempSubmit = () => {
    if (dishwasherState.power === "on") {
      changeTemperature(tempInput);
      setRequestedTemp(tempInput);
      toast.success(`دستور تغییر دمای دستگاه به ${tempInput} درجه ارسال شد`);
      setIsTempInputVisible(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto sm:px-4 py-8">
        <Head>
          <title>نوژن - فر ریلی پیتزا</title>
        </Head>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold z-50 text-gray-800">
            کنترل فر هوشمند پیتزا
          </h1>

          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected
                    ? "bg-green-500"
                    : isConnecting
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected
                  ? "متصل"
                  : isConnecting
                  ? "در حال اتصال..."
                  : "قطع شده"}
              </span>
            </div>
            {!isConnected && !isConnecting && (
              <button
                onClick={manualReconnect}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                تلاش مجدد
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 justify-center items-center z-0 pt-6 mt-auto relative">
          <div className="col-span-4 sm:col-span-3 overflow-hidden relative flex justify-center">
            <div className="flex flex-col pl-[20px]">
              <div className="hidden sm:flex relative">
                <Image src={pizzaovenBack} alt="pizzaoven back side" />
                {/* <Image src={pizzaoven} alt="pizzaoven front side" /> */}
              </div>

              <Image
                src={pizzaovenBack}
                objectFit="cover"
                className="sm:hidden min-w-[700px] h-auto pl-[0px]"
                alt="dishwasher"
              />
              <p className="text-center mt-4 text-gray-500">
                Automatic rail pizzaoven 2230
              </p>
            </div>

            <div className="absolute top-[11%] sm:top-[12%] sm:translate-middle-x controler-boxw-[200px]">
              <div className="controler-item to-black backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-3xl p-4 sm:p-6 text-white relative">
                {loading && (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="border border-white/30 rounded-xl p-4 mb-6 text-center">
                  <div className="text-4xl font-bold">
                    {dishwasherState.power === "on"
                      ? `${dishwasherState.deviceTemperature}°`
                      : "OFF"}
                  </div>
                  <div className="text-sm opacity-70">دما</div>
                  {requestedTemp && (
                    <div className="text-sm mt-1">
                      درخواست شده: {requestedTemp}°
                    </div>
                  )}
                </div>

                <div className="flex justify-around mb-4 gap-8">
                  <Button
                    onClick={handlePowerOn}
                    disabled={dishwasherState.power === "on" || loading}
                    className={`rounded-full w-12 h-12 ${
                      dishwasherState.power === "on"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    ⏻
                  </Button>
                  <Button
                    onClick={handlePowerOff}
                    disabled={dishwasherState.power === "off" || loading}
                    className={`rounded-full w-12 h-12 ${
                      dishwasherState.power === "off"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    ⭘
                  </Button>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <TimeSelector
                    times={availbeTimes}
                    value={convertNumberToTime(dishwasherState.time) || ""}
                    onTimeChange={handleChangeTime}
                    disabled={dishwasherState.power === "off" || loading}
                    className="w-full min-w-[154px]"
                    placeholder="انتخاب زمان پخت"
                  />
                  {requestedTime && (
                    <div className="text-sm mt-1">
                      زمان درخواست شده: {requestedTime}
                    </div>
                  )}
                </div>

                <div
                  className={`flex flex-col gap-2 mb-4 w-full min-w-[154px] ${
                    isTempInputVisible
                      ? "opacity-100 block"
                      : "opacity-0 hidden"
                  }`}
                >
                  <input
                    max={999}
                    min={100}
                    type="number"
                    value={tempInput}
                    onChange={(e) => setTempInput(e.target.value)}
                    className="bg-white/20 placeholder:text-white text-white rounded-lg py-2 text-center w-full"
                    placeholder="دمای مورد نظر"
                    disabled={dishwasherState.power === "off"}
                  />
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={handleTempSubmit}
                      disabled={dishwasherState.power === "off"}
                      className={`flex-1 ${
                        dishwasherState.power === "off"
                          ? "bg-gray-500 cursor-not-allowed w-full"
                          : "bg-white/20 hover:bg-white/30 w-full"
                      }`}
                    >
                      تایید
                    </Button>
                    <Button
                      onClick={() => setIsTempInputVisible(false)}
                      className="flex-1 bg-white/20 hover:bg-white/30"
                    >
                      انصراف
                    </Button>
                  </div>
                </div>
                <div
                  className={`flex justify-center min-w-[154px] mb-1 ${
                    isTempInputVisible
                      ? "opacity-0 hidden"
                      : "opacity-100 block  "
                  }`}
                >
                  <Button
                    onClick={() => setIsTempInputVisible(true)}
                    disabled={dishwasherState.power === "off" || loading}
                    className={`${
                      dishwasherState.power === "off"
                        ? "bg-gray-500 cursor-not-allowed w-full"
                        : "bg-white/20 hover:bg-white/30 w-full"
                    }`}
                  >
                    تغییر دما
                  </Button>
                </div>
                {requestedTemp && (
                  <div className="text-sm text-center">
                    درخواست شده: {requestedTemp}°
                  </div>
                )}

                {/* Torch Switch */}
                <div className="text-center mt-6">
                  <div className="text-sm mb-3">وضعیت مشعل</div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-white/70">
                      {dishwasherState.torchPower ? "روشن" : "خاموش"}
                    </span>
                    <Switch
                      checked={dishwasherState.torchPower}
                      onChange={() =>
                        handleChangeTorch(
                          dishwasherState.torchPower ? "off" : "on"
                        )
                      }
                      disabled={dishwasherState.power === "off" || loading}
                      className="data-[checked]:bg-orange-500"
                    />
                  </div>
                  {requestedCleaningMode && (
                    <div className="text-sm mt-1">
                      درخواست شده: {requestedCleaningMode}
                    </div>
                  )}
                </div>
                <div className="w-full sm:flex hidden justify-end px-2 pt-6">
                  <Image
                    src={logo}
                    className="sm:w-[50%] w-[40%] flex justify-center"
                    alt="dishwasher"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/10 col-span-4 sm:col-span-1 backdrop-blur-lg border border-black/20 p-4 controler-box scale-[1] shadow-xl stats-box self-center rounded-2xl">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت:</span>
                <span
                  className={`font-bold ${
                    dishwasherState.power === "on"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {dishwasherState.power === "on" ? "روشن" : "خاموش"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">دمای فعلی:</span>
                <span className="font-bold">
                  {dishwasherState.deviceTemperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">زمان:</span>
                <span className="font-bold">
                  {convertNumberToTime(Number(dishwasherState.time))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت مشعل:</span>
                <span
                  className={`font-bold ${
                    dishwasherState.torchPower
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {dishwasherState.torchPower ? "روشن" : "خاموش"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                وضعیت خطاها
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">هیتر</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.heaterError
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.heaterError ? "خطا" : "نرمال"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">سنسور</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.sensorError
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.sensorError ? "خطا" : "نرمال"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dishwasher;
