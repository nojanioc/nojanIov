import {
  deleteUser,
  getUsers,
  RegisterFormData,
  registerUser,
  UserType,
} from "@/api/user";
import Layuot from "@/components/layout";
import ConfirmModal from "@/components/modal/confirm";
import { getUserRole } from "@/utils/token";
import {
  Badge,
  Button,
  Card,
  Modal,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const deviceOptions = [
  { value: "dishwasher", label: "ماشین ظرفشویی" },
  { value: "pizza", label: "اجاق پیتزا" },
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    email: string;
    username: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  // Client-side admin check
  useEffect(() => {
    const userRole = session.data?.user?.token
      ? getUserRole(session.data.user.token)
      : null;

    if (userRole !== "admin") {
      router.push("/");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      devices: [{ name: "dishwasher", ip: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "devices",
  });

  const addCustomerByEmail = async (user: RegisterFormData) => {
    try {
      await registerUser(user);
      toast.success("کاربر با موفقیت اضافه شد");
      setAddUserModalOpen(false);
      reset();
      queryClient.invalidateQueries(["users"]);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("خطا در اضافه کردن کاربر");
    }
  };

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const userRole = session.data?.user?.token
    ? getUserRole(session.data.user.token)
    : null;

  const isAdmin = userRole === "admin";

  const handleDeleteClick = (user: UserType) => {
    if (isAdmin) {
      setSelectedUser({
        email: user.email,
        username: user.username,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.email);
        queryClient.invalidateQueries(["users"]);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const usersData = users?.data || [];

  const filteredUsers = usersData.filter(
    (user: UserType) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layuot>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
            <p className="text-gray-600 mt-1">لیست تمام کاربران سیستم</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">تعداد کل کاربران</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.length || 0}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">کاربران فعال</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {usersData?.length}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">کاربران غیرفعال</p>
                <h3 className="text-2xl font-bold text-gray-800">{0}</h3>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="text-nowrap text-right py-4 px-6">
                نام کاربر
              </Table.HeadCell>
              <Table.HeadCell className="text-right py-4 px-6">
                ایمیل
              </Table.HeadCell>
              <Table.HeadCell className="text-right py-4 px-6">
                نقش
              </Table.HeadCell>
              <Table.HeadCell className="text-right py-4 px-6">
                وضعیت
              </Table.HeadCell>
              <Table.HeadCell className="text-right py-4 px-6">
                عملیات
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredUsers.map((user) => (
                <Table.Row key={user.id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 text-right py-4 px-6">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell className="text-right py-4 px-6">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className="text-right py-4 px-6">
                    {user.role}
                  </Table.Cell>
                  <Table.Cell className="text-right py-4 px-6">
                    <Badge className="w-max" color={"success"}>
                      فعال
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right py-4 px-6">
                    <div className="flex gap-4">
                      {user.role !== "admin" && (
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Add User CTA */}
          {isAdmin && (
            <div className="p-4 border-t">
              <Button
                color="light"
                className="w-full"
                onClick={() => setAddUserModalOpen(true)}
              >
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                افزودن کاربر جدید
              </Button>
            </div>
          )}
        </Card>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="حذف کاربر"
          message={`آیا از حذف کاربر ${selectedUser?.username} اطمینان دارید؟`}
          confirmText="بله، حذف شود"
          cancelText="خیر، انصراف"
        />

        {/* Add User Modal */}
        <Modal
          show={addUserModalOpen}
          onClose={() => setAddUserModalOpen(false)}
        >
          <Modal.Header>افزودن کاربر جدید</Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(addCustomerByEmail)}
              className="space-y-4"
            >
              <div>
                <TextInput
                  {...register("username", {
                    required: "نام کاربری الزامی است",
                  })}
                  placeholder="نام کاربری"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <TextInput
                  {...register("email", {
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "ایمیل نامعتبر است",
                    },
                  })}
                  placeholder="ایمیل"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <TextInput
                  {...register("password", {
                    required: "رمز عبور الزامی است",
                    minLength: {
                      value: 6,
                      message: "رمز عبور باید حداقل 6 کاراکتر باشد",
                    },
                  })}
                  type="password"
                  placeholder="رمز عبور"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">دستگاه‌ها</h3>
                  <Button
                    size="sm"
                    onClick={() => append({ name: "dishwasher", ip: "" })}
                  >
                    + افزودن دستگاه
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Select
                        {...register(`devices.${index}.name` as const)}
                        defaultValue={field.name}
                      >
                        {deviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex-1">
                      <TextInput
                        {...register(`devices.${index}.ip` as const, {
                          required: "آدرس IP الزامی است",
                        })}
                        placeholder="آدرس IP"
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        color="failure"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        حذف
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button color="gray" onClick={() => setAddUserModalOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">افزودن کاربر</Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
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

  // Check if user is admin
  const userRole = user.user?.token ? getUserRole(user.user.token) : null;
  if (userRole !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/", // Redirect to home page if not admin
      },
    };
  }

  return {
    props: {},
  };
};

export default Users;
