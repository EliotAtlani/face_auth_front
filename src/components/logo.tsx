import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const Logo = ({ path = "/", className = "" }) => {
  return (
    <Link to={path} className={cn(className, "mx-auto w-32")}>
      <img src="src/assets/logo-dark.png" />
    </Link>
  );
};

export default Logo;
