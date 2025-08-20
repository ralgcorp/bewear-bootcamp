"use client";

import {
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Search,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cart } from "./cart";
import { SearchModal } from "./search-modal";
import { useState } from "react";

export const Header = () => {
  const { data: session } = authClient.useSession();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <header className="container mx-auto flex items-center justify-between p-5">
      <div className="w-[250px] px-5">
        {session?.user ? (
          <>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Button
                  variant="link"
                  size="icon"
                  className="text-black [&_svg:not([class*='size-'])]:size-auto"
                  onClick={() => authClient.signOut()}
                >
                  <UserIcon />
                </Button>
                <div>
                  <h3 className="font-semibold">
                    Olá, {session?.user?.name} !
                  </h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <Button
              size="icon"
              asChild
              variant="link"
              className="text-black [&_svg:not([class*='size-'])]:size-auto"
            >
              <Link href="/authentication">
                <LogInIcon />
              </Link>
            </Button>
            <h2 className="font-semibold">Olá. Faça seu login!</h2>
          </div>
        )}
      </div>

      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex w-[250px] items-center justify-end gap-3">
        <Button
          variant="link"
          className="hidden text-black md:block [&_svg:not([class*='size-'])]:size-auto"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search />
        </Button>
        <div className="separator hidden md:block">|</div>
        <Cart />
        <div className="separator block md:hidden">|</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="link"
              className="block text-black md:hidden [&_svg:not([class*='size-'])]:size-auto"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="rounded-4xl">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/authentication">
                      Login <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
};
