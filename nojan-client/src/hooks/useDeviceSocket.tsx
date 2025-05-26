import deviceSocket from "@/services/deviceSocket";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

const useDeviceSocket = (deviceName: string) => {
  const socketRef = useRef<Socket | null>(null);
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

  const handleSocketConnect = () => {
    if (session && session.data) {
      setIsConnecting(true);
      const socket = deviceSocket(session?.data?.user?.token || "");

      socket.on("connect", () => {
        console.log("Attempting to connect to device:", deviceName);
        socket.emit("connectToDevice", deviceName);
        setIsConnected(true);
        setIsConnecting(false);
      });

      socket.on("disconnected", () => {
        console.log("Disconnected from device");
        setIsConnected(false);
        setIsConnecting(false);
        toast.warning("Disconnected from device");
        setLoading(false);
      });

      socket.on("error", (error) => {
        console.error("Device error:", error);
        setIsConnecting(false);
        toast.error(error);
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
        toast.error("Connection error: " + err.message);
        setLoading(false);
      });

      socketRef.current = socket;
    }
  };

  const sendCode = (code: string, withoutLoading = false) => {
    if (!socketRef.current) {
      console.error("Socket reference not initialized");
      toast.error("Socket not initialized");
      return;
    }

    if (!socketRef.current.connected) {
      console.error("Socket not connected to server");
      toast.error("Not connected to server");
      return;
    }

    if (!isConnected) {
      console.error("Not connected to device");
      toast.error("Not connected to device");
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
      toast.error("Failed to send code to device");
    }
  };

  const turnOnTheDevice = () => {
    sendCode("07");
  };

  const turnOfTheDevice = () => {
    sendCode("08");
  };

  const changeCleaningMode = (value: "01" | "02" | "03" | "04") => {
    sendCode(`0${Number(value) + 2}`);
  };

  const changeTemperature = (value: string) => {
    sendCode("06" + value + "");
  };

  useEffect(() => {
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
  };
};

export default useDeviceSocket;
