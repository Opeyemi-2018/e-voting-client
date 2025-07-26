"use client";
import { MdHowToVote } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { useVoter } from "../context";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const pathName = usePathname();
  const { student } = useVoter();

  return (
    <div className="relative">
      {/* Desktop Navigation */}
      <div className="fixed top-0 z-40 w-full bg-background/60 backdrop-blur-xl border-b">
        <div className="max-w-5xl mx-auto p-3 flex items-center justify-between">
          <Link href="/">
            <MdHowToVote size={30} className="text-blue-600" />
          </Link>

          <nav>
            <ul className="md:flex hidden items-center cursor-pointer justify-between md:gap-6 gap-5 text-[18px]">
              <Link
                href="/"
                className="font-semibold text-[17px] text-gray-600"
              >
                Home
              </Link>
              <Link
                href="/cast-vote"
                className="font-semibold text-[17px] text-blue-600"
              >
                Cast Vote
              </Link>
              {!student && (
                <Link
                  href="/studentAuth/signin"
                  className="font-semibold text-[17px] text-blue-600"
                >
                  Login
                </Link>
              )}

              {student && (
                <Link
                  href="/studentDashboard"
                  className="font-semibold text-[17px] text-blue-600"
                >
                  Dashboard
                </Link>
              )}
            </ul>
          </nav>

          <button
            onClick={() => setShowNav(!showNav)}
            className="md:hidden inline cursor-pointer"
          >
            {showNav ? <LiaTimesSolid size={25} /> : <FaBars size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div
          className={`fixed left-0 top-[9%] z-20 w-full p-10 bg-white border-b transition-transform duration-500 ease-in-out ${
            showNav ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-4 text-[18px] text-blue-600">
              <Link
                href="/"
                onClick={() => setShowNav(false)}
                className="font-semibold"
              >
                Home
              </Link>
              <Link
                href="/cast-vote"
                onClick={() => setShowNav(false)}
                className="font-semibold"
              >
                Cast Vote
              </Link>
              <Link
                href="/cast-vote"
                onClick={() => setShowNav(false)}
                className="font-semibold"
              >
                Check Result
              </Link>
              {student && (
                <Link
                  href="/studentDashboard"
                  onClick={() => setShowNav(false)}
                  className="font-semibold"
                >
                  Dashboard
                </Link>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
