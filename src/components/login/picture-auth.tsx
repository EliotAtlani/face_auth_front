/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, useContext } from "react";
import { Label } from "../ui/label";
import { cn, delay, getWebSocketUrl } from "../../lib/utils";
import { useToast } from "../ui/use-toast";
import ButtonCamera from "../signup/button-camera";
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

type PermissionStatus = "prompt" | "granted" | "denied";

const PictureAuth: React.FC<PictureFormProps> = ({ email, setTab }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>("prompt");
  const [isStreaming, setIsStreaming] = useState(false);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermissionStatus(result.state as PermissionStatus);

      result.onchange = () => {
        setPermissionStatus(result.state as PermissionStatus);
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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      context?.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      return imageDataUrl;
    }
    return null;
  };

  const authContext = useContext(AuthContext);
  const { login } = authContext || {};

  useEffect(() => {
    checkCameraPermission();
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const socket = useRef<WebSocket | null>(null);
  const [, setCount] = useState<number>(0);

  useEffect(() => {
    // Create WebSocket connection
    socket.current = new WebSocket(getWebSocketUrl());

    // Connection opened
    socket.current.addEventListener("open", () => {
      setTimeout(() => {
        const imageDataUrl = captureImage();
        if (imageDataUrl) sendMessage(imageDataUrl);
      }, 1500);
    });

    // Listen for messages
    socket.current.addEventListener("message", async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        toast({
          title: "Face validated",
          description: "Welcome aboard, champ!",
        });
        stopCamera();
        if (login) {
          login(data.access_token, { id: "1", email });
        }
        socket.current?.close();
        navigate("/home");
        return;
      }
      if (data.stop) {
        stopCamera();
        setError("Auth failed. Please try again.");
        socket.current?.close();
        return;
      }
      await delay(400);
      setCount((prevCount) => {
        if (prevCount > 10) {
          stopCamera();
          setError("Auth failed. Please try again.");
          return prevCount; // Return the previous count as no further increment is needed
        }

        const imageDataUrl = captureImage();
        if (imageDataUrl) sendMessage(imageDataUrl);

        return prevCount + 1; // Increment the count
      });
    });

    // Connection closed
    socket.current.addEventListener("close", () => {});

    // Clean up the effect
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  const handleStop = () => {
    socket.current?.close();
    stopCamera();
    setTab("email");
  };

  const sendMessage = async (imageDataUrl: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      const jsonData = {
        email: email,
        imageData: imageDataUrl,
      };
      socket.current.send(JSON.stringify(jsonData));
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <button
        className="absolute top-4 left-4 bg-secondary rounded-full p-1 flex items-center justify-center"
        onClick={handleStop}
      >
        <ChevronLeftIcon size={22} color="#fff" />
      </button>
      {!error && (
        <Label className="text-sm text-center font-bold">
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
                videoRef.current && videoRef.current.srcObject ? "" : "hidden",
                "w-[150px] h-[150px] border-primary rounded-md border-[2px] absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]"
              )}
            />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                videoRef.current && videoRef.current.srcObject ? "" : "hidden",
                "w-full max-w-md rounded-lg shadow-lg mt-4"
              )}
            />
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width={videoRef.current ? videoRef.current.videoWidth : 640}
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
                className="rounded-xl bg-clip-border w-full overflow-hidden"
                alt="Error GIF"
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
