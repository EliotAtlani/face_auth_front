import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import logo from "../assets/logo-dark.png";

const Logo = ({ path = "/", className = "" }) => {
  return (
    <Link to={path} className={cn(className, "mx-auto w-32")}>
      <img src={logo} />
    </Link>
  );
};

export default Logo;
