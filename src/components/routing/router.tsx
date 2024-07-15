import { createBrowserRouter } from "react-router-dom";

import Login from "../../routes/login";
import SignUp from "../../routes/signup";
import PrivateRoute from "./privateRoute";
import Home from "../../routes/home";
import Root from "../../routes/root";
import AuthRoute from "./authRoute";

export const router = createBrowserRouter([
  {
    path: "/home",
    element: <PrivateRoute />, // Wrap the root route with PrivateRoute
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <>
        <Root />
      </>
    ),
  },
  {
    path: "/login",
    element: <AuthRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/signup",
    element: <AuthRoute />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);
