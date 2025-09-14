import { getMe } from "@/api/user";
import Icon from "@/components/icon";
import Layuot from "@/components/layout";
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
import classNames from "classnames";
import { Card } from "flowbite-react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import cookingDevice from "../../public/images/cookingDevice.png";
import DishwasherImage from "../../public/images/dishwasheEdited.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Landing = () => {
  const router = useRouter();
  const session = useSession();
  const user = useQuery("user", () => getMe());
  const devices = user.data?.data.devices || [];

  const machineOptions = [
    {
      value: "dishwasher",
      label: "ماشین ظرفشویی هوشمند",
      description: "مدیریت هوشمند شستشوی ظروف",
      img: DishwasherImage,
      disabled: !devices.includes("dishwasher"),
    },
    {
      value: "pizzaoven",
      label: "فر پیتزا هوشمند",
      description: "فر ریلی پیتزا نوژن مدل 2230N",
      img: cookingDevice,
      disabled: !devices.includes("pizzaoven"),
    },
  ];

  console.log(machineOptions, "machineOptions");

  const handleRedirect = (url: string) => {
    router.push("/devices/" + url);
  };

  return (
    <Layuot>
      <div className="space-y-6">
        <Head>
          <title>نوژن - دشبورد</title>
        </Head>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {/* @ts-ignore */}
                {session.data?.email}
              </h2>
              <p className="text-gray-600 mt-1">خوش آمدید به پنل مدیریت</p>
            </div>
            <div className="mt-4 md:mt-0 bg-white rounded-xl p-4 shadow-sm flex gap-2 items-center">
              <p className="text-gray-600">تعداد دستگاه‌های فعال</p>
              <p className="text-2xl font-bold text-red-600">
                {devices.length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            دستگاه مورد نظر را انتخاب کنید
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machineOptions.map((e) => (
              <Card
                key={e.value}
                className={classNames(
                  "bg-white hover:shadow-lg transition-all duration-300",
                  "rounded-2xl border border-gray-200 relative overflow-hidden",
                  "h-[340px] flex flex-col",
                  e.disabled
                    ? "opacity-50"
                    : "cursor-pointer hover:border-red-200"
                )}
                onClick={() =>
                  e.disabled ? undefined : handleRedirect(e.value)
                }
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {e.label}
                    </h3>
                    <p className="text-gray-600 text-sm">{e.description}</p>
                  </div>
                  <div className="relative">
                    <Image
                      className="absolute left-0 bottom-0"
                      width={300}
                      height={200}
                      src={e.img}
                      alt={e.label}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center justify-center rounded-full w-12 h-12 bg-red-50 hover:bg-red-100 transition-colors duration-300">
                    <Icon name="icon-flesh-75" size={16} color="red" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Preview CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              تحلیل هوشمند دستگاه‌ها با استفاده از (AI) هوش مصنوعی
            </h2>
            <p className="text-gray-600 mt-2 mb-6 max-w-2xl">
              مشاهده تحلیل‌های هوشمند و آمار دقیق استفاده از دستگاه‌های شما.
              سیستم هوشمند ما با بررسی داده‌های استفاده، وضعیت دستگاه‌های شما را
              تحلیل کرده و پیشنهادات بهینه‌سازی ارائه می‌دهد.
            </p>
            <button
              onClick={() => router.push("/stats")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-3 text-lg"
            >
              <Icon name="icon-flesh-75" size={16} color="white" />
              مشاهده آمار و تحلیل‌ها
            </button>
          </div>
        </Card>
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

export default Landing;
