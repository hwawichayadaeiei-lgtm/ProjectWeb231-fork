"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import MyPostsModal from "./MyPosts/MyPostsModal";
import PostSaleModal from "./PostSale/PostSaleModal";

export default function Navbar() {
  const [activeDialog, setActiveDialog] = useState<
    "myPosts" | "sell" | null
  >(null);

  return (
    <>
      <nav className="navbar" aria-label="เมนูหลัก">
        <div className="navList">
          <h1 className="navTitle">Maichailaewnaj</h1>

          <div className="navActions">
            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => setActiveDialog("myPosts")}
            >
              โพสต์ของฉัน
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => setActiveDialog("sell")}
            >
              ลงขายสินค้า
            </button>

            <Link
              className="navButton navButtonSecondary"
              href="/PurchaseHistory"
            >
              ประวัติการซื้อ
            </Link>

            <button
              className="navButton navButtonPrimary"
              onClick={() => void signOut({ callbackUrl: "/" })}
              type="button"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {activeDialog === "myPosts" && (
        <MyPostsModal onClose={() => setActiveDialog(null)} />
      )}

      {activeDialog === "sell" && (
        <PostSaleModal onClose={() => setActiveDialog(null)} />
      )}
    </>
  );
}

