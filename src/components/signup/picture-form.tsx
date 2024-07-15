/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useState } from "react";
import { Label } from "../ui/label";
import ButtonCamera from "./button-camera";

import { Camera, ChevronLeftIcon, RefreshCcwIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import api from "../../lib/axios";
import { useToast } from "../ui/use-toast";

interface PictureFormProps {
  setCroppedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setTab: React.Dispatch<
    React.SetStateAction<"email" | "picture" | "validation">
  >;
}
const PictureForm = ({ setCroppedImage, setTab }: PictureFormProps) => {
  const { toast } = useToast();
  const videoRef = useRef(null);
  const [error, setError] = React.useState<null | string>(null);
  const canvasRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<null | string>(null);

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
      context.drawImage(
        videoRef.current,
        0,
        0,
        // @ts-ignore
        canvasRef.current.width,
        // @ts-ignore
        canvasRef.current.height
      );
      // @ts-ignore
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const reset = () => {
    setCapturedImage(null);
    startCamera();
  };
  useEffect(() => {
    checkCameraPermission();
    startCamera();
    return () => {
      // @ts-ignore
      if (videoRef.current && videoRef.current.srcObject) {
        // @ts-ignore
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
    };
  }, []);

  const handleValidation = async () => {
    try {
      if (!capturedImage) {
        return;
      }
      // Convert base64 image to a file
      const blob = await fetch(capturedImage).then((res) => res.blob());
      const file = new File([blob], "capturedImage.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", file);

      const result = await api.post("/detect-faces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Ensure the response is treated as a blob
      });

      if (result.status === 200) {
        const imageUrl = URL.createObjectURL(result.data);
        setCroppedImage(imageUrl); // Update state with the new image URL
        setTab("validation");
        return;
      }
      toast({
        title: "Error",
        description: "No faces found, please try again.",
        variant: "destructive",
      });
      setCapturedImage(null);
      startCamera();
    } catch (error) {
      toast({
        title: "Error",
        description: "No faces found. Please try again.",
        variant: "destructive",
      });
      setCapturedImage(null);
      startCamera();
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 ">
      <button
        className="absolute top-4 left-4 bg-secondary rounded-full p-1 flex items-center justify-center"
        onClick={() => setTab("email")}
      >
        <ChevronLeftIcon size={22} color="#fff" />
      </button>
      <div className="my-2">
        <Label>
          {" "}
          We need to access your camera to create a face authentication
        </Label>
      </div>

      {permissionStatus === "denied" ? (
        <Label className="text-red-500 text-sm text-center font-bold">
          You have denied camera access. Please allow camera access to proceed.
        </Label>
      ) : (
        <>
          {!capturedImage && (
            <ButtonCamera
              permissions={permissionStatus}
              startCamera={startCamera}
              stopCamera={stopCamera}
              isStreaming={isStreaming}
            />
          )}

          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                "w-full max-w-md rounded-lg shadow-lg",
                capturedImage ? "hidden" : ""
              )}
            />
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="640"
            height="480"
          />

          {isStreaming && (
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
              type="submit"
              onClick={captureImage}
              disabled={!isStreaming}
            >
              <Camera size={16} />
              <span>Take a picture</span>
            </HoverBorderGradient>
          )}

          {capturedImage && (
            <>
              <div className="space-y-2">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="max-w-md rounded-lg shadow-lg"
                />
                <div className="mt-8 flex items-center justify-between">
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    type="submit"
                    onClick={reset}
                  >
                    <RefreshCcwIcon size={16} />
                    <span>Retake</span>
                  </HoverBorderGradient>
                  <HoverBorderGradient
                    containerClassName="rounded-full"
                    as="button"
                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    type="submit"
                    onClick={handleValidation}
                  >
                    <span>Validate</span>
                  </HoverBorderGradient>
                </div>
              </div>
            </>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </>
      )}
    </div>
  );
};

export default PictureForm;
