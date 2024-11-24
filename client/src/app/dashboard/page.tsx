'use client'

import React, { useEffect, useState } from 'react';
import { useStores } from "@/store/MobXProvider";
import { fetchUsers, fetchGroups } from '../../api/adminAPI';
import { fetchCourses } from '../../api/coursesAPI';
import { observer } from 'mobx-react-lite';
import  CourseForm  from './components/CourseForm';
import Spinner from '../../components/Spinner';

const Admin = observer(() => {
  const [loading, setLoading] = useState(true);
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
      <div className="flex gap-3 my-4">


          <CourseForm />
        

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

      </div>
      
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
