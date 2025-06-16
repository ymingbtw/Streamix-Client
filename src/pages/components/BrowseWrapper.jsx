import { KeepAlive } from "react-activation";
import Browse from "../Browse.jsx";

export default function BrowseWrapper() {
  return (
    <KeepAlive>
      <Browse />
    </KeepAlive>
  );
}
