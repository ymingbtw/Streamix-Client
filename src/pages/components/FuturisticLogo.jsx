import { useNavigate } from "react-router-dom";

const FuturisticLogo = (props) => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  return (
    <div
      className="w-[5rem] min-[400px]:w-[10rem] flex"
      style={{ overflow: "visible" }}
    >
      <svg
        viewBox="0 0 300 120"
        width="100%"
        style={{
          maxWidth: "300px",
          display: "flex",
          justifyContent: "center",
          overflow: "visible",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs className={`${props.hover && "hover:cursor-pointer"}`}>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF004F" stopOpacity="1" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Abstract ring + X */}

        {/* Text */}
        <text
          onClick={() => {
            if (path == "/") {
              return;
            }
            navigate("/");
          }}
          className={`${props.hover && "hover:cursor-pointer"} select-none `}
          x="50"
          y="75"
          fontSize="38"
          fontFamily="'Orbitron', sans-serif"
          fill="url(#logoGradient)"
          filter="url(#glow)"
          letterSpacing="2"
        >
          STREAMIX
        </text>
      </svg>
    </div>
  );
};

export default FuturisticLogo;
