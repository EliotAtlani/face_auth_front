/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useState, useContext } from "react";
import { Label } from "../ui/label";

import { cn } from "../../lib/utils";
import { useToast } from "../ui/use-toast";
import ButtonCamera from "../signup/button-camera";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { AuthContext } from "../auth/AuthProvider";
import gif from "../../assets/gif.gif";
interface PictureFormProps {
  email: string;
  setTab: React.Dispatch<
    React.SetStateAction<"email" | "picture" | "validation">
  >;
}
const PictureAuth = ({ email, setTab }: PictureFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [error, setError] = React.useState<null | string>(null);

  const canvasRef = useRef(null);
  let exist = true;
  let count = 0;
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [isStreaming, setIsStreaming] = useState(false);

  const checkCameraPermission = async () => {
    try {
      // @ts-ignore
      const result = await navigator.permissions.query({ name: "camera" });
      setPermissionStatus(result.state);

      result.onchange = () => {
        setPermissionStatus(result.state);
      };
    } catch (err) {
      console.error("Error checking camera permission:", err);
      setError("Unable to check camera permissions.");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsStreaming(true);

      if (videoRef.current) {
        // @ts-ignore
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(
        "Failed to access camera. Please ensure you have given permission."
      );
      console.error("Error accessing the camera:", err);
    }
  };

  const stopCamera = () => {
    // @ts-ignore

    if (videoRef.current && videoRef.current.srcObject) {
      // @ts-ignore
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      // @ts-ignore
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      // @ts-ignore
      const context = canvasRef.current.getContext("2d");
      // @ts-ignore
      const videoWidth = videoRef.current.videoWidth;
      // @ts-ignore
      const videoHeight = videoRef.current.videoHeight;

      // Set canvas dimensions to match the video stream dimensions
      // @ts-ignore
      canvasRef.current.width = videoWidth;
      // @ts-ignore
      canvasRef.current.height = videoHeight;

      // Draw the video stream onto the canvas while maintaining the aspect ratio
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      // @ts-ignore
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      return imageDataUrl;
    }
    return null;
  };

  const authContext = useContext(AuthContext);
  const { login } = authContext;

  const sendImageToBackend = async (imageDataUrl: string) => {
    try {
      const blob = await fetch(imageDataUrl).then((res) => res.blob());
      const file = new File([blob], "capturedImage.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      const result = await api.post("/auth-face/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (result.status === 200) {
        toast({
          title: "Face validated",
          description: "Welcome aboard, champ!",
        });
        stopCamera();
        login(result.data.access_token, {
          id: "1",
          email,
        });
        navigate("/home");
        return;
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        console.error("Face not found");
        exist = false;
      }
      return;
    }
  };

  const handleStop = () => {
    exist = true;
    stopCamera();
    setTab("email");
  };
  useEffect(() => {
    checkCameraPermission();
    startCamera();
    const intervalId = setInterval(() => {
      const imageDataUrl = captureImage();
      count += 1;
      if (count > 4) {
        clearInterval(intervalId);
        stopCamera();
        setError("Auth failed. Please try again.");
        return;
      }
      if (imageDataUrl && exist) {
        sendImageToBackend(imageDataUrl);
      }
    }, 2500);

    return () => {
      // @ts-ignore
      if (videoRef.current && videoRef.current.srcObject) {
        // @ts-ignore
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <button
        className="absolute top-4 left-4 bg-secondary rounded-full p-1 flex items-center justify-center"
        onClick={handleStop}
      >
        <ChevronLeftIcon size={22} color="#fff" />
      </button>
      {!error && (
        <Label className=" text-sm text-center font-bold">
          Please put your head inside the rectangle
        </Label>
      )}

      {permissionStatus === "denied" ? (
        <Label className="text-red-500 text-sm text-center font-bold">
          You have denied camera access. Please allow camera access to proceed.
        </Label>
      ) : (
        <>
          <div className="relative">
            <div
              className={cn(
                // @ts-ignore
                videoRef.current && videoRef.current.srcObject ? "" : "hidden",
                "w-[150px] h-[150px] border-primary rounded-md border-[2px] absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
              )}
            />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                // @ts-ignore
                videoRef.current && videoRef.current.srcObject ? "" : "hidden",
                "w-full max-w-md rounded-lg shadow-lg mt-4"
              )}
            />
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            //@ts-ignore
            width={videoRef.current ? videoRef.current.videoWidth : 640}
            //@ts-ignore

            height={videoRef.current ? videoRef.current.videoHeight : 480}
          />
          {isStreaming && (
            <Label className="text-center">
              Authentication in progress ...
            </Label>
          )}
          {!error && (
            <ButtonCamera
              permissions={permissionStatus}
              startCamera={startCamera}
              stopCamera={stopCamera}
              isStreaming={isStreaming}
            />
          )}

          {error && (
            <>
              <img
                src={gif}
                className="rouded-xl bg-clip-border w-full overflow-hidden"
              />

              <div className="text-red-500 text-md font-bold text-center">
                {error}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PictureAuth;
