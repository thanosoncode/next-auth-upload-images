"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createUser } from "../utils/helpers";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [action, setAction] = useState<"Sign in" | "Sign up">("Sign in");

  const handleActionChange = () =>
    setAction(action === "Sign in" ? "Sign up" : "Sign in");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Authenticating...");

    if (action === "Sign up") {
      if (!formData.email || !formData.password) {
        setMessage("Username and password are required");
        return;
      }

      const newUserResponse = await createUser({
        email: formData.email,
        password: formData.password,
      });

      if (newUserResponse.message !== "success") {
        setMessage(newUserResponse.message);
        return;
      }

      if (newUserResponse.message === "success" && newUserResponse.user) {
        await signIn("credentials", {
          email: newUserResponse.user.email,
          password: newUserResponse.user.password,
          redirect: false,
        });
        setMessage("Sign in success");
        router.push("/store-images");
      }
    }

    const signInResponse = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    setMessage("");

    if (!signInResponse?.error) {
      setMessage("Sign in success");
      router.push("/store-images");
      return;
    }
    setMessage(signInResponse?.error);
    return;
  };

  return (
    <div className="w-3/4 mx-auto">
      <div className="border rounded border-neutral-300 p-3 ">
        <h1 className="mb-6">{action}</h1>
        <form className="flex flex-col gap-3 mb-2" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="emai">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              placeholder="Dummy email here..."
              className="py-1.5 px-1 rounded text-black"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setMessage("")}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              name="password"
              placeholder="Dummy password here..."
              className="py-1.5 px-1 rounded text-black"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setMessage("")}
            />
          </fieldset>
          <button
            type="submit"
            className="py-1.5 px-1 rounded border border-neutral-300 mt-8 duration-200 hover:bg-white hover:text-black ease-out"
          >
            {action}
          </button>
        </form>
        <button
          onClick={handleActionChange}
          className="text-sm text-center mx-auto w-[60%] block rounded hover:bg-neutral-700 duration-200 ease-in-out py-1"
        >
          {action === "Sign in"
            ? "Not a member? Sign up"
            : "Already a member Sign in"}
        </button>
      </div>
      {message ? <p className="mt-4">{message}</p> : null}
    </div>
  );
};
export default SignIn;
