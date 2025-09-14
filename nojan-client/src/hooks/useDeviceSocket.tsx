import deviceSocket from "@/services/deviceSocket";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

const useDeviceSocket = (deviceName: "pizzaoven" | "dishwasher") => {
  const socketRef = useRef<Socket | null>(null);
  const lastToastTimeRef = useRef(0);
  const isFirstConnectionRef = useRef(true);
  const toastCooldown = 10000; // 10 seconds
  const session = useSession();
  const [deviceState, setDeviceState] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      const myInterval = setInterval(() => {
        sendCode("01", true);
      }, 10000);
      return () => clearInterval(myInterval);
    }
  }, [isConnected]);

  const showToastWithCooldown = (
    message: string,
    type: "success" | "warning" | "error" = "success"
  ) => {
    const now = Date.now();
    if (now - lastToastTimeRef.current >= toastCooldown) {
      lastToastTimeRef.current = now;
      if (type === "success") {
        toast.success(message);
      } else if (type === "warning") {
        toast.warning(message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleSocketConnect = () => {
    if (session && session.data) {
      setIsConnecting(true);
      const socket = deviceSocket(session?.data?.user?.token || "", deviceName);

      socket.on("connect", () => {
        console.log(
          "Connected to server, attempting to connect to device:",
          deviceName
        );
        socket.emit("connectToDevice", deviceName);
        setIsConnected(true);
        setIsConnecting(false);

        if (isFirstConnectionRef.current) {
          // showToastWithCooldown("اتصال با دستگاه انجام شد");
          isFirstConnectionRef.current = false;
        } else {
          showToastWithCooldown("اتصال مجدد با دستگاه انجام شد");
        }
      });

      socket.on("disconnected", () => {
        setIsConnected(false);
        setIsConnecting(false);
        showToastWithCooldown("قطع اتصال", "warning");
        setLoading(false);
      });

      socket.on("error", (error) => {
        console.error("Device error:", error);
        setIsConnecting(false);
        showToastWithCooldown(error, "error");
        setLoading(false);
      });

      socket.on("data", (data) => {
        console.log("Data from device:", data);
        setDeviceState(data);
        setLoading(false);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
        setIsConnecting(false);
        showToastWithCooldown("خطای اتصال: " + err.message, "error");
        setLoading(false);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        setIsConnecting(false);
        setLoading(false);
      });

      socketRef.current = socket;
    }
  };

  const sendCode = (code: string, withoutLoading = false) => {
    if (!socketRef.current) {
      console.error("Socket reference not initialized");
      showToastWithCooldown("اتصال اولیه برقرار نشده است", "error");
      return;
    }

    if (!socketRef.current.connected) {
      console.error("Socket not connected to server");
      showToastWithCooldown("به سرور متصل نیست", "error");
      return;
    }

    if (!isConnected) {
      console.error("Not connected to device");
      showToastWithCooldown("به دستگاه متصل نیست", "error");
      return;
    }

    try {
      console.log("Sending code to device:", code);
      socketRef.current.emit("data", code);
      if (!withoutLoading) {
        setLoading(true);
      }
    } catch (error) {
      console.error("Error sending code:", error);
      showToastWithCooldown("ارسال کد به دستگاه ناموفق بود", "error");
    }
  };

  const turnOnTheDevice = () => {
    sendCode("07");
  };

  const turnOfTheDevice = () => {
    sendCode("08");
  };

  const turnOnTheTorch = () => {
    sendCode("04");
  };

  const turnOfTheTorch = () => {
    sendCode("05");
  };

  const changeCleaningMode = (value: "01" | "02" | "03" | "04") => {
    sendCode(`0${Number(value) + 2}`);
  };

  const changeTemperature = (value: string) => {
    sendCode("06" + value + "");
  };

  const changeTime = (value: number) => {
    sendCode("03" + value + "");
  };

  const manualReconnect = () => {
    console.log("Manual reconnect requested");
    isFirstConnectionRef.current = false; // This is a manual reconnect, not first connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    handleSocketConnect();
  };

  useEffect(() => {
    // Reset first connection flag when device name changes
    isFirstConnectionRef.current = true;

    handleSocketConnect();
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
      }
    };
  }, [session, deviceName]);

  return {
    sendCode,
    turnOnTheDevice,
    changeCleaningMode,
    changeTemperature,
    deviceState,
    isConnected,
    isConnecting,
    turnOfTheDevice,
    loading,
    changeTime,
    turnOnTheTorch,
    turnOfTheTorch,
    manualReconnect,
  };
};

export default useDeviceSocket;
