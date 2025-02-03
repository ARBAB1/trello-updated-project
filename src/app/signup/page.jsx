"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Correct import for routing in Next.js
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh
  console.log(name,email,password)
    try {
        const formData = new FormData();
        formData.append("name", `${name}` || name);
        formData.append("email", email);
        formData.append("password", password);
    
      const response = await fetch(`${baseUrl}/users/signUp-user`, {
        method: "POST",
        headers: {
            // 'Content-Type': 'application/json',
            'x-api-key': "TrelloAPIkeyVeryHardItIs",
        },
        body: formData, // Pass FormData as the body
      });
  
      const data = await response.json();
  console.log(data)
      if (response.ok) {
      
        router.push("/"); // Redirect to HomeScreen
      } else {
        console.log(data.message || "Login failed");
      }
    } catch (error) {
      console.log("An error occurred. Please try again later.");
    }
  };
  

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 relative">
      {/* Left Image */}
      <div className="hidden lg:block absolute left-0 bottom-0">
        <Image
          src="/image1.png"
          alt="Left Side Image"
          width={400}
          height={400}
        />
      </div>

      {/* Right Image */}
      <div className="hidden lg:block absolute right-0 bottom-0">
        <Image
          src="/image2.png"
          alt="Right Side Image"
          width={400}
          height={400}
        />
      </div>

      {/* Center Login Box */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm z-10">
        <div className="text-center mb-6">
          <Image
            src="/trello.png"
            alt="Trello Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-2xl font-semibold mt-4 text-black">
            Log in to continue
          </h1>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push("/signUp")}
          >
            Create an account
          </span>
        </div>
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Powered by Ghayas</p>
        </div>
      </div>
    </main>
  );
}
