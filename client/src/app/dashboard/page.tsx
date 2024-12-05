'use client'

import React, { useEffect, useState } from 'react';
import { useStores } from "@/store/MobXProvider";
import { fetchUsers, fetchGroups } from '../../api/adminAPI';
import { fetchCourses } from '../../api/coursesAPI';
import { observer } from 'mobx-react-lite';
import  CourseForm  from './components/CourseForm';
import Spinner from '../../components/Spinner';
import ModalWindow from '@/components/ModalWindow';
import courseHeaderConfig from './components/headerConfigs/courseHeaderConfig';
import SortableTable from './components/SortableTable';
import usersHeaderConfig from './components/headerConfigs/usersHeaderConfig';

const Admin = observer(() => {
  const [loading, setLoading] = useState(true);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const { course, admin } = useStores();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, coursesData, groupsData] = await Promise.all([
          fetchUsers(),
          fetchCourses(),
          fetchGroups()
        ]);
        admin.setUsers(usersData);
        course.setCourses(coursesData);
        admin.setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-4">
      
      <button onClick={() => setIsCreateCourseOpen(true)}>Новый курс</button>
      <CourseForm onClose={() => setIsCreateCourseOpen(false)} isOpen={isCreateCourseOpen}/>

      <div className='flex flex-wrap gap-3'>
        <SortableTable name={'Курсы'} arr={course.courses} headerConfig={courseHeaderConfig}/>
        <SortableTable name={'Продажи'} arr={admin.users} headerConfig={usersHeaderConfig} />
      </div>


        {/* <ModalWindow>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200">
            Создать поток
          </button>
          <GroupForm />
        </ModalWindow> */}

        {/* <ModalWindow>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200">
            Добавить заслуги
          </button>
          <AchieveForm />
        </ModalWindow> */}

      
      {/* <div className="flex flex-wrap gap-3">
        <SortableTable name="Курсы" arr={course.courses} headerConfig={courseHeaderConfig}>
          <CourseEdit />
        </SortableTable>
        <SortableTable name="Продажи" arr={admin.users} headerConfig={usersHeaderConfig} />
        <SortableTable name="Потоки" arr={admin.groups} headerConfig={groupHeaderConfig}>
          <GroupEdit />
        </SortableTable>
      </div> */}
    </div>
  );
});

export default Admin;
