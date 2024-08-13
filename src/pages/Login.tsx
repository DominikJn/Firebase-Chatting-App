import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase-config";
import handleAuthError from "../utils/handleAuthError";
import AnimatedBackground from "../components/AnimatedBackground";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(handleAuthError(error.code));
    }
  }

  return (
    <AnimatedBackground>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-slate-950 backdrop-filter backdrop-blur-sm bg-opacity-60 h-3/5 w-1/4 rounded-lg flex flex-col justify-between p-8 text-white text-2xl"
      >
        <h1 className="text-center text-5xl">Login</h1>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <input
          type="text"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <button
          type="submit"
          className="border-solid border rounded-lg p-3 active:bg-white active:text-slate-800"
        >
          Login
        </button>
        <h2 className="text-red-700 text-center text-lg h-8">{error}</h2>
      </form>
    </AnimatedBackground>
  );
};

export default Login;
