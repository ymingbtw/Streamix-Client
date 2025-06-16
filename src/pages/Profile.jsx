import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#141414] relative overflow-hidden min-h-screen select-none`}
    >
      <div className="text-white absolute p-[1rem] top-2">
        <button
          onClick={() => navigate("/")}
          className="hover:cursor-pointer transition duration-300 hover:text-white/75 text-[clamp(1rem,2vw,3rem)]"
        >
          Back
        </button>
        <div className="flex flex-col">
          <div>Hi, {}</div>
        </div>
      </div>
    </div>
  );
}
