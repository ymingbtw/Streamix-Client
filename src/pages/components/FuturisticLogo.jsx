import { useNavigate } from "react-router-dom";

const FuturisticLogo = (props) => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  return (
    <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        font-size="28"
        font-family="Arial, sans-serif"
        fill="#ff3366"
        dominant-baseline="middle"
        text-anchor="middle"
      >
        ECNET
      </text>
    </svg>
  );
};

export default FuturisticLogo;
