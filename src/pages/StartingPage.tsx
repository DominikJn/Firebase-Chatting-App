import React from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { useNavigate } from "react-router";

const StartingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AnimatedBackground>
      <h1 className="text-8xl font-normal">
        <span>Find new friends with </span>
        <strong>ChatApp</strong>
      </h1>
      <h2 className="text-3xl font-light">
        Sign up and use the best free chatting website!
      </h2>
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/login")}
          className="border-solid border-2 rounded-full py-3 px-6 text-xl"
        >
          Sign In
        </button>
        <span>OR</span>
        <button
          onClick={() => navigate("/register")}
          className="border-solid border-2 rounded-full py-3 px-6 text-xl bg-white text-slate-800"
        >
          Sign Up
        </button>
      </div>
    </AnimatedBackground>
  );
};

export default StartingPage;
