import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("./layouts/guest-layout.tsx", [
        index("routes/home.tsx"),
        route("register", "routes/auth/register.tsx"),
        route("login", "routes/auth/login.tsx")
    ]),
] satisfies RouteConfig;
