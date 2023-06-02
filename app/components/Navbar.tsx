"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LoginLogoutButton from "./LoginLogoutButton";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-400">
      <nav className="flex gap-6 py-4 max-w-[640px] mx-auto">
        <Link
          href="/store-images"
          className={`${
            pathname === "/store-images" ? "text-white" : "text-neutral-400"
          }`}
        >
          Store images
        </Link>
        <LoginLogoutButton />
      </nav>
    </header>
  );
};
export default Navbar;
