import React, { useState } from "react";

export function GamesFull() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-92 flex flex-col items-center">
        <h2 className="text-gray-700 font-medium">All games have filled up!</h2>
        <p className="mt-2 text-gray-400 text-justify">
          Unfortunately, all available games have been filled. Please return the task and keep an eye out for future sessions - thank you!
        </p>
      </div>
    </div>
  );
}