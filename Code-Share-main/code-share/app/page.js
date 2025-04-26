"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import HomePage from "./components/HomePage";
export default function Home() {
  return (
    <div className="bg-white w-screen h-screen">
      <HomePage/>
    </div>
  );
}
