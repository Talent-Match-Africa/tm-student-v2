"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Logout03Icon,
  Menu01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import {
  STUDENT_PROFILE_LINK,
  STUDENT_SIDEBAR_LINKS,
} from "@/constants/student-sidebar";
import { AuthButton } from "@/components/shared/AuthButton";
import { HugeIcon } from "@/components/shared/HugeIcon";
import type { PublicAuthProfile } from "@/types/auth";
import { isStudentSidebarLinkActive } from "./student-sidebar-utils";
import styles from "./StudentTopNav.module.css";

interface StudentTopNavProps {
  onOpenSidebar: () => void;
  profile: PublicAuthProfile;
}

export function StudentTopNav({ onOpenSidebar, profile }: StudentTopNavProps) {
  const pathname = usePathname() ?? "";
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const activeSection = useMemo(
    () =>
      STUDENT_SIDEBAR_LINKS.find((item) =>
        isStudentSidebarLinkActive(pathname, item),
      ) ?? STUDENT_SIDEBAR_LINKS[0],
    [pathname],
  );
  const displayName =
    profile.profile?.displayName?.trim() ||
    profile.name?.trim() ||
    profile.email?.trim() ||
    "Talent Match Student";

  useEffect(() => {
    if (!menuOpen) return;
    function closeOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!logoutOpen || signingOut) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setLogoutOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [logoutOpen, signingOut]);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setLogoutError(null);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setLogoutError("Talent Match could not complete logout right now.");
        setSigningOut(false);
        return;
      }
      window.location.assign(signedOutUrl());
    } catch {
      setLogoutError("Check your connection and try signing out again.");
      setSigningOut(false);
    }
  }

  return (
    <header className={styles.topNav}>
      <div className={styles.leftCluster}>
        <button
          aria-label="Open student navigation"
          className={styles.mobileMenuButton}
          onClick={onOpenSidebar}
          type="button"
        >
          <HugeIcon icon={Menu01Icon} size={20} />
        </button>
        <div className={styles.sectionBadge} aria-hidden="true">
          <HugeIcon icon={activeSection.icon} size={20} />
        </div>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>Student workspace</span>
          <h1 className={styles.title}>{activeSection.label}</h1>
        </div>
      </div>

      <div className={styles.rightCluster}>
        <div className={styles.profileMenu} ref={menuRef}>
          <button
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className={styles.profileCard}
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <StudentAvatar image={profile.image} name={displayName} />
          <span className={styles.profileCopy}>
            <span className={styles.profileName}>{displayName}</span>
            <span className={styles.profileRole}>Student</span>
          </span>
          <span className={styles.profileChevron} aria-hidden="true">
            <HugeIcon icon={ArrowDown01Icon} size={15} />
          </span>
          </button>

          {menuOpen ? (
            <div className={styles.dropdown} role="menu">
            <div className={styles.dropdownHeader}>
              <StudentAvatar image={profile.image} name={displayName} />
              <div>
                <strong>{displayName}</strong>
                <span>{profile.email ?? "No email available"}</span>
              </div>
            </div>
            <Link
              className={styles.profileLink}
              href={STUDENT_PROFILE_LINK.href}
              onClick={() => setMenuOpen(false)}
              role="menuitem"
            >
              <span aria-hidden="true">
                <HugeIcon icon={UserEdit01Icon} size={17} />
              </span>
              Manage profile
            </Link>
            <button
              className={styles.signOutButton}
              onClick={() => {
                setMenuOpen(false);
                setLogoutOpen(true);
              }}
              role="menuitem"
              type="button"
            >
              <span aria-hidden="true">
                <HugeIcon icon={Logout03Icon} size={17} />
              </span>
              Sign out
            </button>
            </div>
          ) : null}
        </div>
      </div>

      {logoutOpen ? (
        <div className={styles.dialogBackdrop} role="presentation">
          <section
            aria-labelledby="student-logout-title"
            aria-modal="true"
            className={styles.dialog}
            role="dialog"
          >
            <div className={styles.dialogIcon} aria-hidden="true">
              <HugeIcon icon={Logout03Icon} size={28} />
            </div>
            <div className={styles.dialogCopy}>
              <p className={styles.dialogEyebrow}>End student session</p>
              <h2 id="student-logout-title">Sign out of Talent Match?</h2>
              <p>
                Your current session will be revoked and secure cookies removed
                from this browser.
              </p>
            </div>
            {logoutError ? (
              <p className={styles.dialogError} role="alert">
                {logoutError}
              </p>
            ) : null}
            <div className={styles.dialogActions}>
              <AuthButton
                className={styles.dialogActionButton}
                disabled={signingOut}
                icon={Cancel01Icon}
                onClick={() => setLogoutOpen(false)}
                type="button"
                variant="secondary"
              >
                Keep me signed in
              </AuthButton>
              <AuthButton
                className={styles.dialogActionButton}
                icon={Logout03Icon}
                isLoading={signingOut}
                loadingLabel="Signing out"
                onClick={() => void signOut()}
                type="button"
              >
                Sign out securely
              </AuthButton>
            </div>
          </section>
        </div>
      ) : null}
    </header>
  );
}

function StudentAvatar({
  image,
  name,
}: {
  image: string | null;
  name: string;
}) {
  if (image) {
    return (
      <Image
        alt={`${name} profile`}
        className={styles.avatar}
        height={44}
        src={image}
        unoptimized
        width={44}
      />
    );
  }
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span className={styles.avatarFallback} aria-label={`${name} profile`}>
      {initials || "TM"}
    </span>
  );
}

function signedOutUrl() {
  const authUrl =
    process.env.NEXT_PUBLIC_AUTH_APP_URL?.trim() || "http://localhost:4000";
  const url = new URL("/login", authUrl);
  url.searchParams.set("reason", "signed_out");
  return url.toString();
}
