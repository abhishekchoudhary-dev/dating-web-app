import { Link } from "react-router";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Match Me</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 gap-2">
                    <li><Link to="/login">Log in</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </div>
        </div>
    );
}