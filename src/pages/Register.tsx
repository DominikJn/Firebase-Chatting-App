import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { setDoc, doc } from "firebase/firestore";
import handleAuthError from "../utils/handleAuthError";
import AnimatedBackground from "../components/AnimatedBackground";
import UserDocData from "../types/UserDocData";
import ErrorMessage from "../components/ErrorMessage";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        const userRef = doc(db, "users", userCredential.user.uid);
        await updateProfile(userCredential.user, { displayName: username });
        //set user doc
        const defaultUserDocData: UserDocData = {
          id: userCredential.user.uid,
          email,
          name: username,
          friends: [],
          invites: [],
          lastSelectedChat: null,
          status: {
            isActive: true,
            lastOnline: null,
          },
        };
        await setDoc(userRef, defaultUserDocData);
      }
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
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="py-3 px-6 bg-inherit border-solid border rounded-lg"
        />
        <button
          type="submit"
          className="border-solid border rounded-lg p-3 active:bg-white active:text-slate-800"
        >
          Register
        </button>
        <ErrorMessage error={error} />
      </form>
    </AnimatedBackground>
  );
};

export default Register;
