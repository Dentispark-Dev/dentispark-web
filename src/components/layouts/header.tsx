"use client";

import { usePathname } from "next/navigation";
import Container from "./container";
import Logo from "../icons/Logo";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/providers/auth-provider";

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, isAdmin, isMentor } = useAuth();

  const dashboardHref = isAdmin
    ? "/admin"
    : isMentor
      ? "/mentor/overview"
      : "/overview";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "/services" },
    { label: "Mentors", href: "/mentors" },
    { label: "Scholarships", href: "/scholarships" },
    { label: "Become a mentor", href: "/become-a-mentor" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Check if scrolled for border effect
      setIsScrolled(currentScrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 bg-white/60 backdrop-blur-xl transition-all duration-500",
        isScrolled ? "border-b border-emerald-500/20 shadow-[0_4px_30px_rgba(16,185,129,0.05)]" : "border-b border-transparent",
      )}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container className="flex items-center justify-between py-5">
        <motion.div
          className="flex items-center space-x-4 lg:space-x-8 xl:space-x-12"
          variants={itemVariants}
        >
          {/* Hamburger for mobile */}
          <motion.button
            className="block cursor-pointer p-2 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect y="6" width="24" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="11" width="18" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="16" width="24" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="cursor-pointer group flex items-center">
              <Logo className="h-[52px] w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            className="hidden space-x-1 lg:flex xl:space-x-4"
            variants={itemVariants}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-2 py-1 text-[13px] font-semibold tracking-wide transition-all duration-300 whitespace-nowrap",
                    pathname === item.href 
                      ? "text-emerald-600" 
                      : "text-gray-500 hover:text-emerald-500",
                  )}
                >
                  <span className="relative z-10 font-sora">{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      className="absolute inset-0 -z-10 bg-emerald-50/50 blur-[2px] rounded-full"
                      layoutId="activeNavBg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-[2px] bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: pathname === item.href ? "100%" : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>

        {/* Desktop Action buttons / Logged-in user */}
        <motion.div
          className="hidden items-center space-x-3 lg:flex xl:space-x-5"
          variants={itemVariants}
        >
          {isAuthenticated && user ? (
            <Link href={dashboardHref} className="flex items-center gap-3 group">
              <div className="bg-primary font-sora flex size-9 shrink-0 items-center justify-center rounded-full font-bold text-white uppercase ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                {user.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="font-sora">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.fullName}</p>
                <p className="text-xs text-primary font-medium">Go to Dashboard →</p>
              </div>
            </Link>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Link href="/login">
                  <Button className="font-sora h-10" variant="outline">Log In</Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Link href="/sign-up">
                  <Button className="font-sora h-10">Sign Up</Button>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Mobile: show avatar if logged in, else Sign Up */}
        <motion.div
          className="block lg:hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAuthenticated && user ? (
            <Link href={dashboardHref}>
              <div className="bg-primary font-sora flex size-9 items-center justify-center rounded-full font-bold text-white uppercase">
                {user.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
            </Link>
          ) : (
            <Link href="/sign-up">
              <Button className="font-sora h-10 px-5 py-2 text-sm">Sign Up</Button>
            </Link>
          )}
        </motion.div>
      </Container>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 bottom-0 z-[100] flex h-screen flex-col px-4 pt-4"
            style={{ backgroundColor: "white" }}
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="mb-8 flex items-center justify-between"
              variants={mobileItemVariants}
            >
              <motion.button
                className="p-2"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Close icon */}
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
            <motion.nav
              className="mt-4 flex flex-col gap-8 px-2"
              variants={mobileItemVariants}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={mobileItemVariants}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="text-black-600 cursor-pointer text-base font-medium transition-colors duration-300 hover:text-green-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
            <motion.div className="mt-10 px-2" variants={mobileItemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/login">
                  <Button className="font-sora" variant="outline">
                    Log In
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
