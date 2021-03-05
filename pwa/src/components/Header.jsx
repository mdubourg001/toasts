import React from "react";

import { ReactComponent as Cross } from "../svg/cross.svg";

export default function Header() {
  return (
    <nav className="w-full bg-gray-800 p-4 border-b-4 border-yellow-400">
      <strong className="flex items-center justify-center space-x-2 font-brand text-white font-bold text-xl">
        <Cross className="text-yellow-400 transform rotate-12 pt-1" />
        <span>ISS TRACKER</span>
      </strong>
    </nav>
  );
}
