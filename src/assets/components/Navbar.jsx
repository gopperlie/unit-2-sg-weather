import { Link } from "react-router-dom";

export default function Navbar () {
    return (
    <nav>
      <ul>
        <li>
        <Link to="/">Home</Link>
        </li>
        <li>
        <Link to="/Rainfall">Any Rain?</Link>
        </li>
        <li>
        <Link to="/UVIndex">UV Index</Link>
        </li>
        <li>
        <Link to="/Weather2hrs">2 hrs forecast</Link>
        </li>
      </ul>
    </nav>
);
}