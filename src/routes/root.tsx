import { useNavigate } from "react-router-dom";
import { EvervaultCard, Icon } from "../components/ui/evervault-card";
import { FlipWords } from "../components/ui/flip-words";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { Label } from "../components/ui/label";
import "./root.css";
import logo from "../assets/logo.png";
function Root() {
  const words = ["awesome", "performant", "secured", "modern"];

  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center relative no-scroll">
      <div className="my-gradient "></div>
      <div className="my-gradient2"></div>

      <div className="w-4/5 flex sm:flex-row flex-col items-center sm:items-start gap-4 sm:gap-2">
        <div className="flex flex-col sm:items-start items-center">
          <img src={logo} className="sm:w-48 w-32" />
          <div className="text-2xl sm:text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400 mt-4 sm:text-left text-center">
            Integrate
            <FlipWords words={words} />
            <br />
            face authentication to your website
          </div>
          <div className="flex w-full gap-8 items-center mt-8 justify-center sm:justify-start">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 w-[100px] "
              onClick={() => navigate("/signup")}
            >
              <span className="mx-auto">Sign up</span>
            </HoverBorderGradient>
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 w-[100px] "
              onClick={() => navigate("/login")}
            >
              <span className="mx-auto">Login</span>
            </HoverBorderGradient>
          </div>
          <div className="mt-8">
            <span className="text-xs dark:text-[#c1c1c1]">
              {" "}
              Facial authentication by{" "}
              <a
                href="mailto:eliot.atlani01@gmail.com"
                className="underline hover:text-primary transition ease-in-out duration-500"
              >
                Eliot Atlani
              </a>
            </span>
          </div>
        </div>

        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start w-[300px] sm:w-[400px] mx-auto p-4 relative">
          <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
          <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

          <EvervaultCard text="Face Auth" />

          <Label className="dark:text-[#f2f2f2]  mt-4 text-sm font-medium text-center mx-auto">
            This website is for demonstration purposes only.
          </Label>
        </div>
      </div>
    </div>
  );
}

export default Root;
