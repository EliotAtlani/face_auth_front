/* eslint-disable @typescript-eslint/no-explicit-any */
import { Boxes } from "../components/ui/background-boxes";
import { Icon } from "../components/ui/evervault-card";
import Logo from "../components/logo";
import { useState } from "react";
import { emailSchema } from "../lib/zod";
import { useToast } from "../components/ui/use-toast";
import EmailForm from "../components/signup/email-form";
import PictureForm from "../components/signup/picture-form";
import api from "../lib/axios";
import useIsSmartphone from "../lib/hook";

const SignUp = () => {
  const [tab, setTab] = useState<"email" | "picture" | "validation">("email");
  const [email, setEmail] = useState<string | null>(null);
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
          <PictureForm setTab={setTab} email={email as string} />
        )}
      </div>
    </div>
  );
};

export default SignUp;
