import dishwasher from "@/../public/images/dishwasher.png";
import dishwasherMobile from "@/../public/images/dishwasherMobile.png";
import logo from "@/../public/images/logo.png";
import Layout from "@/components/layout";
import useDeviceSocket from "@/hooks/useDeviceSocket";
import getDeviceData from "@/utils/getDeviceData";
import { Button } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const cleaningModes = [
  { value: "0", label: "اولیه" },
  { value: "1", label: "یک" },
  { value: "2", label: "دو" },
  { value: "3", label: "سه" },
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
  } = useDeviceSocket("dishwasher");

  const dishwasherState = getDeviceData("dishwasher", deviceState);

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
    toast.success("دستگاه روشن شد");
  };

  const handlePowerOff = () => {
    turnOfTheDevice();
    toast.success("دستگاه خاموش شد");
  };

  const handleModeChange = (value: string) => {
    if (dishwasherState.power === "on") {
      changeCleaningMode(value as "01" | "02" | "03");
      toast.success("درخواست تغییر حالت شستشو به حالت " + value + " ارسال شد");
      setRequestedCleaningMode(value);
    }
  };

  const handleTempSubmit = () => {
    if (dishwasherState.power === "on") {
      changeTemperature(tempInput);
      setRequestedTemp(tempInput);
      toast.success(`دستور تغییر دمای دستگاه به ${tempInput} درجه ارسال شد`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto sm:px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold z-50 text-gray-800 sm:mb-8">
          کنترل ماشین ظرفشویی
        </h1>
        <div className="grid grid-cols-4 gap-6 justify-center items-center z-0 pt-6 mt-auto relative sm:mt-[-100px]">
          <div className="col-span-4 sm:col-span-3 overflow-hidden relative flex justify-center">
            <div className="flex flex-col">
              <Image
                src={dishwasher}
                objectFit="cover"
                className="hidden sm:block pr-[32px] min-w-[1000px] min-h-[1000px] justify-center"
                alt="dishwasher"
              />
              <Image
                src={dishwasherMobile}
                objectFit="cover"
                className="sm:hidden pr-[13px]"
                alt="dishwasher"
              />
              <p className="text-center mt-4 text-gray-500">
                Automatic rail dishwasher NCDW-4000
              </p>
            </div>

            <div className="absolute top-[24%] sm:top-[24%] sm:translate-middle-x controler-boxw-[200px]">
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

                <div className="flex justify-around mb-4">
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

                {isTempInputVisible ? (
                  <div className="flex flex-col gap-2 mb-4 w-full">
                    <input
                      max={99}
                      min={10}
                      type="number"
                      value={tempInput}
                      onChange={(e) => setTempInput(e.target.value)}
                      className="bg-white/20 placeholder:text-white text-white rounded-lg px-3 py-2 text-center w-[154px] sm:w-[160px]"
                      placeholder="دمای مورد نظر"
                      disabled={dishwasherState.power === "off"}
                    />
                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={handleTempSubmit}
                        disabled={dishwasherState.power === "off"}
                        className={`flex-1 ${
                          dishwasherState.power === "off"
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-white/20 hover:bg-white/30"
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
                ) : (
                  <div className="flex justify-center mb-4 ">
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
                )}

                {/* Mode Selector */}
                <div className="text-center mt-6">
                  <div className="text-sm mb-2">حالت شستشو</div>
                  <div className="grid grid-cols-2 gap-2">
                    {cleaningModes.map((mode) => (
                      <Button
                        key={mode.value}
                        onClick={() => handleModeChange(mode.value)}
                        disabled={dishwasherState.power === "off" || loading}
                        className={`rounded-lg ${
                          mode.value === dishwasherState.cleaningMode
                            ? "bg-white/60 border-2 border-white font-bold shadow-lg"
                            : "bg-white/20 hover:bg-white/30"
                        } px-2 py-1 transition-all duration-200`}
                      >
                        <span className="text-xs text-nowrap">
                          {mode.label}
                        </span>
                      </Button>
                    ))}
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
                <span className="text-gray-600">حالت شستشو:</span>
                <span className="font-bold">
                  {cleaningModes.find(
                    (mode) => mode.value === dishwasherState.cleaningMode
                  )?.label || "نامشخص"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت درب:</span>
                <span
                  className={`font-bold ${
                    dishwasherState.isDoorOpen === "open"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {dishwasherState.isDoorOpen === "open" ? "باز" : "بسته"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت آب:</span>
                <span
                  className={`font-bold ${
                    dishwasherState.isWaterFull === "full"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {dishwasherState.isWaterFull === "full" ? "پر" : "خالی"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                وضعیت خطاها
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">کنتاکتور اصلی</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.contactor === "1"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.contactor === "1" ? "خطا" : "نرمال"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">پمپ اول</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.pomp1 === "1"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.pomp1 === "1" ? "خطا" : "نرمال"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">پمپ دوم</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.pomp2 === "1"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.pomp2 === "1" ? "خطا" : "نرمال"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">پمپ سوم</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.pomp3 === "1"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.pomp3 === "1" ? "خطا" : "نرمال"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">هیتر</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      dishwasherState.heater === "1"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {dishwasherState.heater === "1" ? "خطا" : "نرمال"}
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
