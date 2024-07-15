/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";

interface EmailFormProps {
  handleEmail: (e: any) => void;
  login: boolean;
}
const EmailForm = ({ handleEmail, login }: EmailFormProps) => {
  return (
    <>
      <form className="flex flex-col w-full" onSubmit={handleEmail}>
        <div className="mt-4 w-full flex flex-col gap-2">
          <Label className="font-bold mt-4 text-xl">
            {login ? "Login" : "Sign Up"}
          </Label>
          <Input
            name="email"
            id="email"
            className="w-full"
            placeholder="example@auth.com"
            required
          />
        </div>
        <div className="mt-4 flex justify-end w-full">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            type="submit"
          >
            <span> Continue </span>
          </HoverBorderGradient>
        </div>
      </form>
      <Separator className="my-4" />
      <div className="flex justify-center items-center gap-2 mx-auto">
        <Label>
          {" "}
          {login ? "New to Face Auth?" : "Already have an account ?"}{" "}
        </Label>
        <Link to={login ? "/signup" : "/login"} className="text-primary">
          {" "}
          {login ? "Sign up" : "Login"}{" "}
        </Link>
      </div>
    </>
  );
};

export default EmailForm;
