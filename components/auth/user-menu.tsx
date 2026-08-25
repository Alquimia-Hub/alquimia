"use client";

import { LayoutGrid, LogOut, Shield, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { SignInDialog } from "./sign-in-dialog";

const SIGN_IN_LABEL =
  "font-[family-name:var(--font-im-fell)] text-[10px] tracking-[0.3em]";

export function UserMenu() {
  const t = useTranslations("Auth");
  const tAccount = useTranslations("Account");
  const tAlquimista = useTranslations("Alquimista");
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <span
        aria-label={t("loading")}
        className="relative inline-flex h-7 items-center"
        role="status"
      >
        <span aria-hidden="true" className={`invisible px-3 ${SIGN_IN_LABEL}`}>
          {t("signIn")}
        </span>
        <Skeleton className="absolute inset-0 rounded-full bg-bg-3" />
      </span>
    );
  }

  const user = session?.user;

  if (!user) {
    return (
      <>
        <Button
          className={SIGN_IN_LABEL}
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
          <UserAvatar
            className="size-7 border-rule"
            hideAvatar={user.hideAvatar}
            image={user.image}
            name={user.name}
          />
          {user.isAlquimista && (
            <Sparkles
              aria-hidden="true"
              className="absolute -top-1 -right-1 size-3 fill-gold/40 text-gold drop-shadow-[0_0_6px_var(--gold)]"
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

        <DropdownMenuItem asChild>
          <Link href="/alquimista">
            <Sparkles className="size-4" />
            {tAlquimista("name")}
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
