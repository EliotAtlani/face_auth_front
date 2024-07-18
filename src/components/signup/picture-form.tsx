/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef, useEffect, useState } from "react";
import { Label } from "../ui/label";

import { Camera, ChevronLeftIcon, RefreshCcwIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import api from "../../lib/axios";
import { useToast } from "../ui/use-toast";
import CircleLoader from "react-spinners/CircleLoader";
import { useNavigate } from "react-router-dom";

interface PictureFormProps {
  setTab: React.Dispatch<
    React.SetStateAction<"email" | "picture" | "validation">
  >;
  email: string;
}
const PictureForm = ({ setTab, email }: PictureFormProps) => {
  const { toast } = useToast();
  const videoRef = useRef(null);
  const [error, setError] = React.useState<null | string>(null);
  const canvasRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    }
  };

  const captureImage = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      // @ts-ignore
      const context = canvasRef.current.getContext("2d");
      // @ts-ignore

      const videoWidth = videoRef.current.videoWidth;
      // @ts-ignore

      const videoHeight = videoRef.current.videoHeight;
      // @ts-ignore

      canvasRef.current.width = videoWidth;
      // @ts-ignore

      canvasRef.current.height = videoHeight;

      context?.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      // @ts-ignore

      return canvasRef.current.toDataURL("image/jpeg");
    }
    return null;
  };

  const captureBatchImages = async () => {
    setIsCapturing(true);
    const imageBatch: string[] = [];

    for (let i = 0; i < 10; i++) {
      const imageDataUrl = captureImage();
      if (imageDataUrl) {
        imageBatch.push(imageDataUrl);
      }
      await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay
    }

    const firstImage = imageBatch[0];
    setCapturedImages(imageBatch);
    displayUserCroppedImage(firstImage);
  };

  const transformImage = async (
    image: string,
    formData: FormData,
    index: number
  ) => {
    // Convert base64 image to a file
    const blob = await fetch(image).then((res) => res.blob());
    const file = new File([blob], `capturedImage-${index}.jpg`, {
      type: "image/jpeg",
    });

    formData.append(`file_${index}`, file);
  };

  const reset = () => {
    setCapturedImages([]);
    setIsCapturing(false);
    setIsFinished(false);
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

  const displayUserCroppedImage = async (capturedImage: string) => {
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

      const result = await api.post("/detect-faces/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Ensure the response is treated as a blob
      });

      if (result.status === 200) {
        const imageUrl = URL.createObjectURL(result.data);
        setCroppedImage(imageUrl); // Update state with the new image URL
        setIsCapturing(false);
        stopCamera();
        setIsFinished(true);
        return;
      }
      toast({
        title: "Error",
        description: "No faces found, please try again.",
        variant: "destructive",
      });
      setCapturedImages([]);
      setIsCapturing(false);
      startCamera();
    } catch (error) {
      toast({
        title: "Error",
        description: "No faces found. Please try again.",
        variant: "destructive",
      });
      setCapturedImages([]);
      setIsCapturing(false);
      startCamera();
    }
  };

  const handleGoBack = () => {
    stopCamera();
    setTab("email");
  };

  const handleValidation = async () => {
    setLoading(true);
    try {
      if (!email) {
        toast({
          title: "No email provided",
          description: "Please provide an email",
        });
        return;
      }

      const formData = new FormData();

      const promises: Promise<void>[] = [];
      capturedImages.forEach((imageDataUrl, index) => {
        promises.push(transformImage(imageDataUrl, formData, index));
      });

      await Promise.all(promises);
      formData.append("email", email);

      const result = await api.post("/validate-face-batch/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        toast({
          title: "Face validated",
          description: "You can now login",
        });
        navigate("/login");
        return;
      }
    } catch (err) {
      console.error("Error validating image:", err);
      toast({
        title: "Error validating image",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 ">
      <button
        className="absolute top-4 left-4 bg-secondary rounded-full p-1 flex items-center justify-center"
        onClick={handleGoBack}
      >
        <ChevronLeftIcon size={22} color="#fff" />
      </button>
      {permissionStatus === "prompt" && (
        <div className="my-2 w-full sm:text-left text-center">
          <Label className=" w-full">
            We need to access your camera to create a face authentication
          </Label>
        </div>
      )}

      {permissionStatus === "denied" && (
        <Label className="text-red-500 text-sm text-center font-bold">
          You have denied camera access. Please allow camera access to proceed.
        </Label>
      )}
      {permissionStatus === "granted" && (
        <>
          <div className="my-2 w-full sm:text-left text-center">
            {isFinished ? (
              <Label className="text-center">
                Images captured successfully. Please valid if the image is clear
              </Label>
            ) : (
              <Label className=" w-full">
                Please center your face in the camera and take a picture
              </Label>
            )}
          </div>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                "w-full max-w-md rounded-lg shadow-lg",
                isFinished ? "hidden" : ""
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

          {!isCapturing && !isFinished && (
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
              type="submit"
              onClick={captureBatchImages}
              disabled={isCapturing}
            >
              <Camera size={16} />
              <span>Take a picture</span>
            </HoverBorderGradient>
          )}

          {isCapturing && (
            <Label className="text-center flex flex-col gap-2 items-center justify-center">
              <CircleLoader size={50} color="#16a34a" />
              Capturing images, please wait ...
            </Label>
          )}

          {isFinished && (
            <>
              <div className="space-y-2">
                <img
                  src={croppedImage ?? capturedImages[0]}
                  alt="Captured"
                  className="rounded-lg shadow-lg mx-auto"
                />
                {loading ? (
                  <div className="flex justify-center">
                    <CircleLoader size={50} color="#16a34a" />
                  </div>
                ) : (
                  <>
                    <div className="mt-8 flex items-center justify-between gap-4">
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
                  </>
                )}
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
