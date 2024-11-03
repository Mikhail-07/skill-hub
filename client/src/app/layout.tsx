import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import YandexMetrika from "@/components/YandexMetrika";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Анна Царева - Профессиональный Коуч | Личный Рост и Развитие",
  description: "Опытный коуч Анна Царева помогает достигать личных и профессиональных целей. Индивидуальные сессии и программы развития для максимальных результатов.",
  keywords: "коучинг, личностный рост, развитие карьеры, профессиональный коуч, Анна Царева",
  openGraph: {
    title: "Анна Царева - Профессиональный Коуч",
    description: "Индивидуальные коучинговые программы от Анны Царевой для достижения ваших целей. Профессиональный подход и проверенные методики.",
    url: "https://tsarevaschool.ru/",
    images: [
      {
        url: "/avatar.jpg",
        width: 180,
        height: 180,
        alt: "Анна Царева - Профессиональный Коуч",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {<YandexMetrika/>}
      </body>
    </html>
  );
}
