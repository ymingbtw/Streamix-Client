import { KeepAlive } from "react-activation";
import Home from "../Home.jsx";

export default function HomeWrapper() {
  return (
    <KeepAlive>
      <Home />
    </KeepAlive>
  );
}
