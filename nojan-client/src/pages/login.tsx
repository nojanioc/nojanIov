import { RegisterFormData } from "@/api/user";
import { Button } from "flowbite-react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Logo from "../../public/images/logo.png";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormData>({});

  const router = useRouter();
  const handleSubmitForm = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (res?.ok) {
        router.push("/");
        return;
      }
      if (res?.error) {
        toast(res?.error, { type: "error" });
        setLoading(false);
      }
    } catch (e) {
      toast("خطایی رخ داد. لطفا دوباره تلاش کنید", { type: "error" });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Head>
        <title>نوژن - ورود</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
          {/* Logo and Welcome Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <Image
                src={Logo}
                width={80}
                height={80}
                alt="Logo"
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              خوش آمدید!
            </h1>
            <p className="text-gray-600">
              لطفا برای ورود به پنل مدیریت، مشخصات خود را وارد کنید
            </p>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="space-y-6"
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ایمیل
                  </label>
                  <input
                    {...register("email", {
                      required: {
                        value: true,
                        message: "لطفا ایمیل خود را وارد کنید",
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "لطفا یک ایمیل معتبر وارد کنید",
                      },
                    })}
                    type="email"
                    name="email"
                    id="email"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200`}
                    placeholder="example@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    رمز عبور
                  </label>
                  <input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "لطفا رمز عبور خود را وارد کنید",
                      },
                      minLength: {
                        value: 6,
                        message: "رمز عبور باید حداقل 6 کاراکتر باشد",
                      },
                    })}
                    type="password"
                    name="password"
                    id="password"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${
                    loading
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      در حال ورود...
                    </span>
                  ) : (
                    "ورود به پنل مدیریت"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
