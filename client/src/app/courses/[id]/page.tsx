"use client"

import { fetchCourse } from "@/api/coursesAPI";
import { useEffect, useState } from "react";

interface CoursePageProps {
  params: {
    id: string;
  };
}

const CoursePage = ({ params }: CoursePageProps) => {
  const { id } = params;
  const [course, setCourse] = useState({})


  useEffect(() => {
    debugger
    fetchCourse(id)
      .then(data => setCourse(data))
  //   if (user.isAuth) fetchUserCourses(email).then(data => {user.setCourses(data)})
  }, [id])

  // const signUpForCourse = async () => {
  //   registrationOnCourse({email, courseId: id}).then(() => navigate(PROFILE_ROUTE))
  // }

  return( 
    <div>
      {course.title ?
      <div>
        <h1>
          Курс «{course.title}»
        </h1>
        <h6>
          {course.subTitle}
        </h6>
      </div>
    : <div>Course ID: {id}</div>
      }
      
    </div>
    )
};

export default CoursePage;
