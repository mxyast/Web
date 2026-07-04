"use client";

import React, { useState, useEffect } from "react";
import { TypeCNavbar } from "@repo/ui/typec-navbar";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

interface ClientNavbarWrapperProps {
  user?: {
    name: string;
    role: string;
  } | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
    children?: { id: string; name: string; slug: string; }[];
  }[];
}

export function ClientNavbarWrapper({ user, categories }: ClientNavbarWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartCount = isMounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = isMounted ? wishlistItems.length : 0;

  return <TypeCNavbar user={user} cartCount={cartCount} wishlistCount={wishlistCount} categories={categories} />;
}
