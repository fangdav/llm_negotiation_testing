import React from "react";

export function Avatar({ src }) {
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      src={src}
      alt="Avatar"
    />
  );
}
