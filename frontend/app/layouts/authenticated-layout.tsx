import { Outlet } from "react-router";

export default function GuestLayout() {
    return (
        <>
            <h1>This is authenticated layout</h1>
            <Outlet />
        </>
    );
}