import { useState, useEffect } from "react";
import api from "../lib/axios";
import { motion } from "framer-motion";
import { Label } from "./ui/label";

const ServerStatus = () => {
  const [isServerUp, setIsServerUp] = useState(true);

  const checkServerStatus = async () => {
    try {
      const response = await api.get("/ping/");
      console.log("Response: ", response);
      if (response.status === 200) {
        setIsServerUp(true);
      } else {
        setIsServerUp(false);
      }
    } catch (error) {
      setIsServerUp(false);
    }
  };

  useEffect(() => {
    // Check server status on component mount
    checkServerStatus();

    // Set up an interval to check the server status every 10 seconds
    const intervalId = setInterval(checkServerStatus, 20000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  console.log("Server status: ", isServerUp);

  if (!isServerUp) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 1 }}
        className="px-4 py-2 absolute bg-background/[0.2] backdrop-blur-sm dark:border-white/[0.2] border-[1px] rounded-md  top-4 left-[50%] transform translate-x-[-50%] z-50"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <Label className="text-red-500">Server is down</Label>
        </div>
      </motion.div>
    );
  }
};

export default ServerStatus;
