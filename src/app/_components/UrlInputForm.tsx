"use client";

import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";

export default function UrlInputForm() {
  const [textValue, setTextValue] = useState("");
  const [result, setResult] = useState<{
    isError: boolean;
    message: string;
    shortUrl?: string;
    fullUrl?: string;
  }>({
    isError: false,
    message: "",
  });
  const mutaion = api.urlShortener.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
      setTextValue("");
      setResult({
        isError: false,
        message: `The url ${textValue} is successfully added.`,
        shortUrl: data.shortUrl,
        fullUrl: data.fullUrl,
      });
    },
    onError: (e) => {
      console.error(e);
      setResult({
        isError: true,
        message: `Failed to shorten the url ${textValue}.`,
      });
    },
  });
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await mutaion.mutateAsync({ fullUrl: textValue });
  }

  return (
    <div className="flex w-full max-w-screen-sm flex-col items-center justify-center gap-3 px-5">
      <form onSubmit={handleSubmit} className="flex w-full gap-2 px-5">
        <label htmlFor="fullUrl" className="sr-only">
          Url
        </label>
        <input
          required
          placeholder="Enter full url"
          type="url"
          name="fullUrl"
          id="fullUrl"
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          className="flex-grow resize-none overflow-hidden rounded-lg border-2 border-indigo-600 px-2 py-2 text-lg outline-none"
        />
        <button
          className="rounded-full bg-blue-500 px-5 py-2 text-white transition-colors duration-200 hover:bg-blue-400 focus-visible:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          Shrink
        </button>
      </form>
      {result.message && result.message.trim().length > 0 && (
        <div
          className={`${result.isError ? "text-red-700" : "text-emerald-600"}`}
        >
          {result.message}
        </div>
      )}

      {Boolean(result.shortUrl) && Boolean(result.fullUrl) && (
        <div className="mt-3">
          Short url is{" "}
          <a
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            href={`/${result.shortUrl}`}
            target="_blank"
          >
            /{result.shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
