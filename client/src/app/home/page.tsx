"use client"

import { useState } from "react";
import ModalWindow from "@/components/ModalWindow";
import RegistrationForm from "@/app/home/components/RegistrationForm";
import { achievements, danceAchieve } from "./db";
import TelegramCard from "@/app/home/components/TelegramCard";
import AchieveSection from "@/app/home/components/AchieveSection";
import PriceSection from "@/app/home/components/PriceSection";
import FadingCover from "@/components/FadingCover";
import AboutMeCard from "@/app/home/components/AboutMeCard";
import AboutMeCardFullWidth from "@/app/home/components/AboutMeCardFullWidth";
import WithWhomCard from "@/app/home/components/WithWhomCard";
import FreeSessionCard from "@/app/home/components/FreeSessionCard";
import FaqSection from "@/app/home/components/FaqSection";
import AskQuestionCard from "@/app/home/components/AskQuestionCard";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <ModalWindow onClose={() => setIsFormModalOpen(false)} isOpen={isFormModalOpen}>
        <RegistrationForm isFormModalOpen={ isFormModalOpen } onClose={() => setIsFormModalOpen(false)}/>
      </ModalWindow>
      <FadingCover setIsFormModalOpen={ setIsFormModalOpen } />
      <div className="bg-slate-900 rounded-t-3xl relative z-20">
        <AboutMeCard />
        <AboutMeCardFullWidth />
        <WithWhomCard setIsFormModalOpen={setIsFormModalOpen}/>
        <FreeSessionCard setIsFormModalOpen={ setIsFormModalOpen }/>
        <PriceSection setIsFormModalOpen={ setIsFormModalOpen } />
        <FaqSection />
        <div className="flex flex-wrap justify-around">
          <AskQuestionCard />
          <TelegramCard />
          <AchieveSection achievements={achievements} header={'Мои заслуги, работа и медийность'} />
          <AchieveSection achievements={danceAchieve} header={'Участие в танцевальных соревнованиях'} />
        </div>
      </div>
    </main>
  );
}
