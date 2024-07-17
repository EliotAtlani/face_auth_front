/* eslint-disable @typescript-eslint/no-explicit-any */
import { Boxes } from "../components/ui/background-boxes";
import { Icon } from "../components/ui/evervault-card";
import Logo from "../components/logo";
import { useState } from "react";
import { emailSchema } from "../lib/zod";
import { useToast } from "../components/ui/use-toast";
import EmailForm from "../components/signup/email-form";
import PictureForm from "../components/signup/picture-form";
import Validation from "../components/signup/validation";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import useIsSmartphone from "../lib/hook";

const SignUp = () => {
  const [tab, setTab] = useState<"email" | "picture" | "validation">("email");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isSmartphone = useIsSmartphone();
  const handleEmail = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    //Validate email with zod
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      toast({
        title: "Invalid email",
        description: "Please use a valid email",
      });
      return;
    }

    try {
      const form = new FormData();
      form.append("email", email);
      await api.post("/check-email/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEmail(email);
      setTab("picture");
    } catch (error) {
      console.error("Error checking email:", error);
      toast({
        title: "Email already exists",
        description: "Please try again",
      });
      e.reset();
      return;
    }
    setEmail(email);
    setTab("picture");
  };

  const handleValidation = async () => {
    setLoading(true);
    try {
      if (!croppedImage) {
        toast({
          title: "No image captured",
          description: "Please capture an image",
        });
        return;
      }

      if (!email) {
        toast({
          title: "No email provided",
          description: "Please provide an email",
        });
        return;
      }
      // Convert base64 image to a file
      const blob = await fetch(croppedImage).then((res) => res.blob());
      const file = new File([blob], "capturedImage.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      const result = await api.post("/validate-face/", formData, {
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
    <div className="h-screen relative w-full overflow-hidden bg-background flex flex-col items-center justify-center">
      {isSmartphone ? (
        <>
          <div className="my-gradient " style={{ zIndex: 1 }}></div>
          <div className="my-gradient2" style={{ zIndex: 1 }}></div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 w-full h-full bg-background/100 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
        </>
      )}
      <div className="border bg-background/[0.1] backdrop-blur-sm border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-[300px] sm:w-[400px] mx-auto p-4 relative px-4sm:px-8 z-20">
        <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

        <Logo />
        {tab === "email" && (
          <EmailForm handleEmail={handleEmail} login={false} />
        )}
        {tab === "picture" && (
          <PictureForm setCroppedImage={setCroppedImage} setTab={setTab} />
        )}
        {tab === "validation" && (
          <Validation
            croppedImage={croppedImage as string}
            setTab={setTab}
            handleValidation={handleValidation}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default SignUp;
