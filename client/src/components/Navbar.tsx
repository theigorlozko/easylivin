"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-md"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="relative flex items-center justify-between w-full py-3 px-4 sm:px-8 bg-white text-primary-800">
        {/* Left section */}
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link href="/" className="cursor-pointer" scroll={false}>
            <div className="flex items-center gap-2">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                EASY
                <span className="text-green-500 font-light">LIVIN</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center section - hidden on mobile */}
        {/* <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          {isDashboardPage && authUser && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm sm:text-base"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-5 w-5" />
                  <span className="hidden md:block ml-2">Add Property</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span className="hidden md:block ml-2">Search</span>
                </>
              )}
            </Button>
          )}
        </div> */}

        {/* Right section */}
        <div className="flex items-center gap-3 sm:gap-5">
          {authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={authUser.userInfo?.image} />
                  <AvatarFallback className="bg-green-600 text-white">
                    {authUser.userRole?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium hidden md:block">
                  {authUser.userInfo?.name}
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-primary-700">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-primary-700 hover:text-white font-medium"
                  onClick={() =>
                    router.push(
                      authUser.userRole?.toLowerCase() === "manager"
                        ? "/managers/properties"
                        : "/tenants/favorites",
                      { scroll: false }
                    )
                  }
                >
                  Go to Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary-200" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-primary-700 hover:text-white"
                  onClick={() =>
                    router.push(
                      `/${authUser.userRole?.toLowerCase()}s/settings`,
                      { scroll: false }
                    )
                  }
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-primary-700 hover:text-white"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin">
                <Button className="bg-white text-primary-600 border border-primary-300 rounded-full px-5 py-2 hover:bg-primary-50 hover:border-primary-400 transition-all shadow-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 text-white rounded-full px-5 py-2 hover:bg-green-700 transition-all shadow-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
