import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userRef = collection(db, "users");
    const userCredenital = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredenital.user) {
      await updateProfile(userCredenital.user, { displayName: username });
      await addDoc(userRef, { email: email, name: username });
    }
  }

  return (
    <div className="h-full grid place-items-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-slate-900 backdrop-filter backdrop-blur-sm bg-opacity-60 h-3/5 w-1/4 rounded-lg flex flex-col justify-between p-8 text-white text-2xl"
      >
        <h1 className="text-center text-5xl">Register</h1>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
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
      </form>
    </div>
  );
};

export default Register;
