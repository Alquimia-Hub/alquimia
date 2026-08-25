"use client";

import { LayoutGrid, LogOut, Shield, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { SignInDialog } from "./sign-in-dialog";

export function UserMenu() {
  const t = useTranslations("Auth");
  const tAccount = useTranslations("Account");
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <span aria-hidden="true" className="size-7" />;
  }

  const user = session?.user;

  if (!user) {
    return (
      <>
        <Button
          className="font-[family-name:var(--font-im-fell)] text-[10px] tracking-[0.3em]"
          data-testid="header-signin"
          onClick={() => setSignInOpen(true)}
          size="sm"
          variant="ghost"
        >
          {t("signIn")}
        </Button>
        <SignInDialog onOpenChange={setSignInOpen} open={signInOpen} />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("account")}
          className="relative flex items-center"
          data-testid="header-user-menu"
          type="button"
        >
          <Avatar className="size-7 border border-rule">
            <AvatarImage alt="" src={user.image ?? undefined} />
            <AvatarFallback className="bg-bg-3 text-[10px] text-ink-2">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {user.isAlquimista && (
            <Sparkles
              aria-label="Alquimista"
              className="absolute -top-1 -right-1 size-3 fill-gold/40 text-gold"
            />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 border-rule bg-bg-2">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="size-4" />
            {tAccount("title")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/launchpad/my-projects">
            <LayoutGrid className="size-4" />
            {tAccount("myProjects")}
          </Link>
        </DropdownMenuItem>

        {user.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link data-testid="menu-admin" href="/admin/launchpad">
              <Shield className="size-4" />
              {tAccount("adminPanel")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          data-testid="menu-signout"
          onSelect={async () => {
            await authClient.signOut();
            router.refresh();
          }}
        >
          <LogOut className="size-4" />
          {tAccount("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
