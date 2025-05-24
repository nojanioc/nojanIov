import { RegisterFormData } from "@/api/user";
import classNames from "classnames";
import { Button, Card } from "flowbite-react";
import Image from "next/image";
import { useForm } from "react-hook-form";

const machineOptions = [
  {
    value: "dishwasher",
    label: "ماشین ظرفشویی هوشمند",
    img: "dishwasher.svg",
  },
  {
    value: "pizzaoven",
    label: "اجاق پیتزا هوشمند",
    img: "pizza.svg",
  },
];

const Register = ({
  handleSubmitForm,
  loading,
}: {
  handleSubmitForm: (value: RegisterFormData) => void;
  loading: boolean;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: { machines: ["dishwasher"] },
  });

  const { machines } = watch();

  const handleSetActiveMachines = (value: string) => {
    const actives = [...machines];
    if (!actives.includes(value)) {
      actives.push(value);
      setValue("machines", actives);
    } else if (actives.includes(value)) {
      const index = actives.findIndex((e) => e === value);
      actives.splice(index, 1);
      setValue("machines", actives);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center lg:py-0">
        <div className="space-y-4 md:space-y-6 w-full">
          <form className="space-y-4 md:space-y-6" action="#">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                ایمیل کاربر جدید
              </label>
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
              />
              {errors.email ? (
                <span className="text-red-600 text-sm">
                  {errors.email?.message}
                </span>
              ) : null}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                رمز عبور کاربر جدید
              </label>
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.password ? (
                <span className="text-red-600 text-sm">
                  {errors.password?.message}
                </span>
              ) : null}
            </div>

            <div className="w-100">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                دسترسی کاربر به دستگاه
              </label>
              <div className="flex sm:flex-row flex-col gap-3">
                {machineOptions.map((e) => {
                  return (
                    <Card
                      onClick={() => {
                        handleSetActiveMachines(e.value);
                      }}
                      key={e.value}
                      className={classNames(
                        machines.includes(e.value)
                          ? "bg-indigo-600"
                          : "bg-transparent",
                        "rounded-3xl sm:w-[50%] w-[100%] cursor-pointer border-gray-300 border-4 relative pb-[30%] overflow-hidden"
                      )}
                    >
                      <p
                        className={classNames(
                          machines.includes(e.value)
                            ? "text-white"
                            : "text-black",
                          " font-bold text-lg"
                        )}
                      >
                        {e.label}
                      </p>
                      <Image
                        className="absolute bottom-0 left-0"
                        width={173}
                        height={158}
                        src={e.img}
                        alt="dishwasher"
                      />
                      {machines.includes(e.value) ? (
                        <div className="flex justify-center items-center rounded-[100%] w-[46px] h-[46px] bg-white absolute bottom-[16px] right-[16px]">
                          <Image
                            width={20}
                            height={20}
                            src={"/active.svg"}
                            alt="active-item"
                          />
                        </div>
                      ) : null}
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between"></div>
            <Button
              disabled={loading}
              onClick={handleSubmit(handleSubmitForm)}
              type="submit"
              className=" w-full text-whitehover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-indigo-600"
            >
              ساخت حساب
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
