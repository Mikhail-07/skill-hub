"use client"

import { createContext, useContext } from 'react';
import UserStore from './UserStore';
import CourseStore from './CoursesStore';
import AdminStore from '@/store/AdminStore';
// import AchieveStore from '@/store/AchieveStore';

interface Stores {
  user: UserStore;
  course: CourseStore;
  admin: AdminStore
}

export const MobXContext = createContext<Stores | null>(null);

export const useStores = () => {
  const context = useContext(MobXContext);
  if (!context) {
    throw new Error("useStores must be used within a MobXProvider.");
  }
  return context;
};

const MobXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stores: Stores = {
    user: new UserStore(),
    course: new CourseStore(),
    admin: new AdminStore(),
    // achieve: new AchieveStore(),
  };

  return <MobXContext.Provider value={stores}>{children}</MobXContext.Provider>;
};

export default MobXProvider;
