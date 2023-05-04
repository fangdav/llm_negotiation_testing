import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20 container mx-auto">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instruction One
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          Your task is to negotiate a deal with the other user.
        </p>
      </div>
      <Button onClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
