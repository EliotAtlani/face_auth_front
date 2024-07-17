import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import logo from "../assets/logo.png";

const Logo = ({ path = "/", className = "" }) => {
  return (
    <Link to={path} className={cn(className, "mx-auto sm:w-44 w-24")}>
      <img src={logo} />
    </Link>
  );
};

export default Logo;
