"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="bg-blue-100 py-44 h-screen flex items-center flex-col gap-12">
      <div className="text-8xl text-center font-bold flex flex-row">
        <p className="text-blue-800">Git</p>
        <p>Doctor</p>
      </div>
      <div className="flex flex-row gap-2">
        <Input
          id="github-repo"
          type="text"
          placeholder="https://github.com/user/repo/"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-96 bg-white text-xl"
          required
        />
        <Button
          type="submit"
          className="bg-blue-800 hover:bg-blue-900"
        >
            <Link href={`/doc?url=${inputValue.slice(19)}`}>
              Submit
            </Link>
        </Button>
      </div>
      <div className="text-xl flex flex-col gap-4">
        <div className="flex justify-center font-bold">
          Instructions
        </div>
        <div className="flex flex-col gap-3">
          <p>1. Enter a link to a GitHub repository</p>
          <p>2. GitDoctor will analyze the repository</p>
          <p>3. View the resulting documentation!</p>
        </div>
      </div>
    </div>
  );

}
