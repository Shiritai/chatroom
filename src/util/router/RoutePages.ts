import SignIn from "../../components/auth/SignIn";
import SignUp from "../../components/auth/SignUp";
import Home from "../../components/page/Home";
import IndexPage from "../../components/page/Index";
import Page404 from "../../components/page/Page404";
// import Profile from "../../components/page/Profile";
import SignPage from "../../components/page/Sign";

/**
 * Page Router storing page information
 * such as page name, component function and path
 */
export class RoutePages {
  name: string;
  component: () => JSX.Element;
  path: string;

  static readonly PAGE_INDEX = new RoutePages("Index Page", IndexPage, "/");
  static readonly PAGE_404 = new RoutePages("404", Page404, "/404");
  static readonly SIGN = new RoutePages("Get Start", SignPage, "/sign");
  static readonly SIGN_IN = new RoutePages("Sign in", SignIn, "/signin");
  static readonly SIGN_UP = new RoutePages("Sign up", SignUp, "/signup");

  // ---[testing pages]---
  static readonly HOME = new RoutePages("Home page", Home, "/home");
  // static readonly PROFILE = new RoutePages("Profile", Profile, "/profile");

  private constructor(
    name: string,
    component: () => JSX.Element,
    path: string
  ) {
    this.name = name;
    this.component = component;
    this.path = path;
  }
}

/**
 * Streamer to stream reachable pages
 */
export const PageStream: RoutePages[] = (() =>
  Object.entries(RoutePages).map(([_, v]) => v))();
// implement using lambda since we may use more than once
