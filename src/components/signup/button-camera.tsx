import { Camera } from "lucide-react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

interface ButtonCameraProps {
  permissions: "granted" | "prompt" | "denied";
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  isStreaming: boolean;
}
const ButtonCamera = ({
  permissions,
  startCamera,
  stopCamera,
  isStreaming,
}: ButtonCameraProps) => {
  if (isStreaming) {
    return (
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        type="submit"
        onClick={stopCamera}
      >
        <Camera className="h-4 w-4" />
        <span>Stop Camera</span>
      </HoverBorderGradient>
    );
  }
  if (permissions === "prompt") {
    return (
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        type="submit"
        onClick={startCamera}
      >
        <span> Authorize camera access </span>
      </HoverBorderGradient>
    );
  }
  return (
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      type="submit"
      onClick={startCamera}
    >
      <Camera className="h-4 w-4" />
      <span>Start Camera</span>
    </HoverBorderGradient>
  );
};

export default ButtonCamera;
