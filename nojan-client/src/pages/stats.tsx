import { getMe } from "@/api/user";
import Layuot from "@/components/layout";
import useDeviceSocket from "@/hooks/useDeviceSocket";
import {
  DeviceNameType,
  getHistory,
  HistoryType,
} from "@/services/historyService";
import { UserData } from "@/services/userService";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Card, Tabs } from "flowbite-react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DeviceStatus {
  temperature: number;
  isOn: boolean;
  cleaningMode: number;
  errors: {
    mainContactor: boolean;
    pump1: boolean;
    pump2: boolean;
    pump3: boolean;
    door: boolean;
    waterLevel: boolean;
  };
}

interface UsageStats {
  daily: number;
  weekly: number;
  monthly: number;
  average: number;
}

interface Insights {
  status: string;
  temperature: number;
  cleaningMode: number;
  errorCount: number;
  recommendations: string[];
}

const Stats = () => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceNameType | "">("");

  // Get user data to show device tabs
  const { data: userData } = useQuery<UserData, Error, UserData>(
    "userData",
    async () => {
      const res = await getMe();
      return {
        ...res.data,
        devices: res.data.devices.map((d) => ({ name: d, ip: "" })),
      } as UserData;
    },
    {
      onSuccess: (data) => {
        if (data.devices.length > 0 && !selectedDevice) {
          setSelectedDevice(data.devices[0].name as DeviceNameType);
        }
      },
    }
  );

  // Get history data for selected device
  const { data: historyData, isLoading: isHistoryLoading } = useQuery(
    ["history", selectedDevice],
    () =>
      getHistory({
        params: {
          deviceName: selectedDevice as DeviceNameType,
          limit: 100,
        },
      }),
    {
      enabled: !!selectedDevice,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    }
  );

  const history = historyData?.history || [];
  const { deviceState } = useDeviceSocket(selectedDevice);

  const parseDeviceStatus = (status: string): DeviceStatus => {
    return {
      temperature: parseInt(status.substring(0, 2)),
      isOn: status[2] === "1",
      cleaningMode: parseInt(status[3]),
      errors: {
        mainContactor: status[4] === "1",
        pump1: status[5] === "1",
        pump2: status[6] === "1",
        pump3: status[7] === "1",
        door: status[8] === "1",
        waterLevel: status[9] === "1",
      },
    };
  };

  // Get current device status
  const getCurrentStatus = (): DeviceStatus | null => {
    if (history.length === 0) return null;
    return parseDeviceStatus(deviceState);
  };

  // Calculate usage statistics
  const calculateUsageStats = (): UsageStats | null => {
    if (history.length === 0) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const dailyUsage = history.filter(
      (h: HistoryType) =>
        new Date(h.receivedAt) >= today && h.status.toString()[2] === "1"
    ).length;

    const weeklyUsage = history.filter(
      (h: HistoryType) =>
        new Date(h.receivedAt) >= weekStart && h.status.toString()[2] === "1"
    ).length;

    const monthlyUsage = history.filter(
      (h: HistoryType) => h.status.toString()[2] === "1"
    ).length;

    return {
      daily: dailyUsage,
      weekly: weeklyUsage,
      monthly: monthlyUsage,
      average: Math.round(monthlyUsage / 30),
    };
  };

  // Generate temperature chart data
  const getTemperatureChartData = () => {
    const lastWeekData = history.slice(0, 7).reverse();

    return {
      labels: lastWeekData.map((h: HistoryType) =>
        new Date(h.receivedAt).toLocaleDateString("fa-IR")
      ),
      datasets: [
        {
          label: "دمای دستگاه",
          data: lastWeekData.map((h: HistoryType) =>
            parseInt(h.status.toString().substring(0, 2))
          ),
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4,
        },
      ],
    };
  };

  // Generate usage pattern chart data
  const getUsagePatternData = () => {
    const lastMonthData = history.slice(0, 30).reverse();

    return {
      labels: lastMonthData.map((h: HistoryType) =>
        new Date(h.receivedAt).toLocaleDateString("fa-IR")
      ),
      datasets: [
        {
          label: "وضعیت دستگاه",
          data: lastMonthData.map((h: HistoryType) =>
            h.status.toString()[2] === "1" ? 1 : 0
          ),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
        },
      ],
    };
  };

  // Generate AI insights
  const generateInsights = (): Insights | null => {
    if (history.length === 0) return null;

    const currentStatus = getCurrentStatus();
    if (!currentStatus) return null;

    const usageStats = calculateUsageStats();
    const errorCount = history.filter((h: HistoryType) =>
      h.status.toString().substring(4).includes("1")
    ).length;

    return {
      status: currentStatus.isOn ? "فعال" : "خاموش",
      temperature: currentStatus.temperature,
      cleaningMode: currentStatus.cleaningMode,
      errorCount,
      recommendations: [
        errorCount > 0
          ? "توصیه می‌شود دستگاه را برای بررسی خطاها سرویس کنید"
          : null,
        currentStatus.temperature > 30
          ? "دمای دستگاه بالاست، بررسی کنید"
          : null,
        usageStats?.daily && usageStats.daily > 10
          ? "استفاده روزانه بالا است، بهینه‌سازی کنید"
          : null,
      ].filter(Boolean) as string[],
    };
  };

  const currentStatus = getCurrentStatus();
  const usageStats = calculateUsageStats();
  const insights = generateInsights();
  const temperatureChartData = getTemperatureChartData();
  const usagePatternData = getUsagePatternData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Layuot>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">آمار و گزارشات</h1>
          <p className="text-gray-600 mt-1">نمایش آمار استفاده از دستگاه‌ها</p>
        </div>

        {/* Device Tabs */}
        <Tabs
          onActiveTabChange={(tab) => {
            const device = userData?.devices[tab];
            if (device) {
              setSelectedDevice(device.name as DeviceNameType);
            }
          }}
        >
          {userData?.devices.map((device) => (
            <Tabs.Item
              key={device.name}
              active={selectedDevice === device.name}
              title={
                device.name === "dishwasher" ? "ماشین ظرفشویی" : "پیتزا پز"
              }
            />
          ))}
        </Tabs>

        {selectedDevice && (
          <>
            <div
              className={`relative ${
                isHistoryLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {isHistoryLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">استفاده امروز</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {usageStats?.daily || 0} بار
                      </h3>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">استفاده این هفته</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {usageStats?.weekly || 0} بار
                      </h3>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">استفاده این ماه</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {usageStats?.monthly || 0} بار
                      </h3>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">میانگین روزانه</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {usageStats?.average || 0} بار
                      </h3>
                    </div>
                    <div className="bg-white p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    تغییرات دما
                  </h3>
                  <div className="h-[400px] w-full flex items-center justify-center">
                    <div className="w-full h-full">
                      <Line
                        options={chartOptions}
                        data={temperatureChartData}
                      />
                    </div>
                  </div>
                </Card>
                <Card>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    الگوی استفاده
                  </h3>
                  <div className="h-[400px] w-full flex items-center justify-center">
                    <div className="w-full h-full">
                      <Line options={chartOptions} data={usagePatternData} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Current Status and AI Analysis */}
              {currentStatus || insights ? (
                <Card className="mt-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {currentStatus && (
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          وضعیت فعلی دستگاه
                        </h2>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-600">وضعیت</p>
                              <p
                                className={`text-lg font-semibold ${
                                  currentStatus.isOn
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {currentStatus.isOn ? "فعال" : "خاموش"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">دمای دستگاه</p>
                              <p className="text-lg font-semibold">
                                {currentStatus?.temperature
                                  ? currentStatus?.temperature + " °C"
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">حالت شستشو</p>
                              <p className="text-lg font-semibold">
                                {currentStatus?.cleaningMode || "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">تعداد خطاها</p>
                              <p className="text-lg font-semibold">
                                {
                                  Object.values(currentStatus.errors).filter(
                                    Boolean
                                  ).length
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Error Status */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            وضعیت خطاها
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(currentStatus.errors).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-gray-600">
                                    {key === "mainContactor"
                                      ? "کنتاکتور اصلی"
                                      : key === "pump1"
                                      ? "پمپ اول"
                                      : key === "pump2"
                                      ? "پمپ دوم"
                                      : key === "pump3"
                                      ? "پمپ سوم"
                                      : key === "door"
                                      ? "در"
                                      : "سطح آب"}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded ${
                                      value
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                    }`}
                                  >
                                    {value ? "خطا" : "نرمال"}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {insights && (
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          تحلیل هوشمند
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              وضعیت کلی
                            </h4>
                            <p className="text-gray-600 text-sm">
                              دستگاه در حال حاضر {insights.status} است و دمای آن{" "}
                              {insights?.temperature
                                ? insights?.temperature + " °C"
                                : "-"}{" "}
                              می‌باشد.
                              {insights.errorCount > 0
                                ? ` ${insights.errorCount} خطا در سیستم شناسایی شده است.`
                                : " هیچ خطایی در سیستم وجود ندارد."}
                            </p>
                          </div>
                          {insights.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">
                                توصیه‌ها
                              </h4>
                              <ul className="text-gray-600 text-sm space-y-2">
                                {insights.recommendations.map((rec, index) => (
                                  <li key={index}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : null}
            </div>
          </>
        )}
      </div>
    </Layuot>
  );
};

export const getServerSideProps = async function (
  ctx: GetServerSidePropsContext
) {
  const user = await getSession({ ctx });

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return {
    props: {},
  };
};

export default Stats;
