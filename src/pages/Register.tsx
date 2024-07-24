import React from "react";

const Register: React.FC = () => {
  return (
    <div className="h-full grid place-items-center">
      <form className="bg-slate-900 backdrop-filter backdrop-blur-sm bg-opacity-60 h-3/5 w-1/4 rounded-lg flex flex-col justify-between p-8 text-white text-2xl">
        <h1 className="text-center text-5xl">Register</h1>
        <input
          type="email"
          placeholder="Email"
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <input
          type="text"
          placeholder="Password"
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <button
          type="submit"
          className="border-solid border rounded-lg p-3 active:bg-white active:text-slate-800"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Register;
