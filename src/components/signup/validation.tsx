import React from "react";
import { Label } from "../ui/label";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { RefreshCcwIcon } from "lucide-react";
import CircleLoader from "react-spinners/CircleLoader";
interface ValidationProps {
  croppedImage: string;
  setTab: React.Dispatch<
    React.SetStateAction<"email" | "picture" | "validation">
  >;
  handleValidation: () => Promise<void>;
  loading: boolean;
}
const Validation = ({
  croppedImage,
  setTab,
  handleValidation,
  loading,
}: ValidationProps) => {
  const reset = () => {
    setTab("picture");
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 over">
      <div className="my-2">
        <Label> Here&apos;s your face, please validate it</Label>
      </div>
      <div className="space-y-2 w-full">
        <img
          src={croppedImage}
          alt="Captured"
          className="w-4/5 mx-auto rounded-md shadow-lg mb-4"
        />
        {loading ? (
          <div className="w-full flex justify-center">
            <CircleLoader size={50} color="#16a34a" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Validation;
