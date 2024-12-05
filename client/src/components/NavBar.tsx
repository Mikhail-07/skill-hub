"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStores } from "@/store/MobXProvider";
import Link from "next/link";
import OffcanvasMenu from "./OffcanvasMenu";
import { observer } from "mobx-react-lite";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const { user } = useStores();
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const logOut = () => {
    user.setUser({});
    user.setAuth(false);
    localStorage.removeItem("token");
  };

  const updateNavbarHeight = () => {
    if (navbarRef.current) {
      const navbarHeight = navbarRef.current.offsetHeight;
      document.documentElement.style.setProperty("--navbar-height", `${navbarHeight}px`);
    }
  };

  useEffect(() => {
    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, [menuOpen]);

  return (
    <nav ref={navbarRef} className="bg-slate-900 text-white fixed top-0 w-full z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          Твоя школа
        </div>
        <button
          onClick={toggleMenu}
          className="text-white md:hidden focus:outline-none"
        >
          <span className="sr-only">Открыть меню</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={`md:flex items-center ${menuOpen ? "block" : "hidden"}`}>
          <Link href="/courses" className="block mt-4 md:inline-block md:mt-0 mr-6">
            Курсы
          </Link>
          <Link href="/coaching" className="block mt-4 md:inline-block md:mt-0 mr-6">
            Коучинг
          </Link>
          {user.isAuth ? (
            <>
              <Link href="/profile" className="block mt-4 md:inline-block md:mt-0 mr-6">
                Мой кабинет
              </Link>
              {user.user.role === "ADMIN" && (
                <Link href="/dashboard" className="block mt-4 md:inline-block md:mt-0 mr-6">
                  Админ панель
                </Link>
              )}
              <button onClick={logOut} className="block mt-4 md:inline-block md:mt-0">
                Выйти
              </button>
            </>
          ) : (
            <Link href="/auth" className="block mt-4 md:inline-block md:mt-0">
              Войти
            </Link>
          )}
        </div>
      </div>
      <OffcanvasMenu isOpen={menuOpen} onClose={toggleMenu}>
        <nav className="flex flex-col space-y-4">
          <Link href="/courses" onClick={toggleMenu}>Курсы</Link>
          <Link href="/coaching" onClick={toggleMenu}>Коучинг</Link>
          {user.isAuth ? (
            <>
              <Link href="/profile" onClick={toggleMenu}>Мой кабинет</Link>
              {user.user.role === "ADMIN" && (
                <Link href="/dashboard" onClick={toggleMenu}>Админ панель</Link>
              )}
              <button onClick={() => { logOut(); toggleMenu(); }}>Выйти</button>
            </>
          ) : (
            <Link href="/auth" onClick={toggleMenu}>Войти</Link>
          )}
        </nav>
      </OffcanvasMenu>
    </nav>
  );
};

export default observer(NavBar);
