"use client"

import Link from "next/link";

export default function Error() {
  // You can access the error object and a reset function here
  return (
    <div className="mt-16 flex min-h-screen flex-col items-center gap-5">
      <h1 className="text-3xl text-rose-700">Something went wrong!</h1>
      <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" href="/">Home</Link>
    </div>
  );
}
