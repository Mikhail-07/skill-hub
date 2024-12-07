"use client"

import { fetchCourse } from "@/api/coursesAPI";
import Card from "@/components/Card";
import ContentSection from "@/components/ContentSection";
import FadingCoverWrapper from "@/components/FadingCoverWrapper";
import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import ImageSection from "@/components/ImageSection";
import SimpleCell from "@/components/SimpleCell";
import { Course } from "@/types";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";

interface CoursePageProps {
  params: {
    id: string;
  };
}

const CoursePage = ({ params }: CoursePageProps) => {
  const { id } = params;
  const [course, setCourse] = useState<Course>()


  useEffect(() => {
    fetchCourse(id)
      .then(data => setCourse(data))
  //   if (user.isAuth) fetchUserCourses(email).then(data => {user.setCourses(data)})
  }, [id])

  // const signUpForCourse = async () => {
  //   registrationOnCourse({email, courseId: id}).then(() => navigate(PROFILE_ROUTE))
  // }
  if (!course) return null

  return( 
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <FadingCoverWrapper>
        <ImageSection imageSrc={process.env.NEXT_PUBLIC_API_URL! + course.img} />
        {/* `${course.category} «${course.title}»` */}
        <ContentSection
          subtitle={`${course.category} от Анны Царевой`}
          title={course.title}
          description={course.subTitle}
          buttons={
          <div>
            <p className="mt-8 text-lg font-bold">Купившим курс в первый день продаж бонус - {course.firstDayBonus}</p>
            <GradientButton buttonText="Предзапись на курс" buttonLink="https://t.me/Anna_School_bot"/>
          </div>}
        />
      </FadingCoverWrapper>

      <div className="flex-shrink-0 bg-slate-900 rounded-t-3xl relative z-20">
        {course.additionalBlocks.map(({title, content}) => 
        <Card header={title} mode='light' key={title}>
          <p className="mb-8 text-lg font-bold">
            {content}
          </p>
        </Card>
        )}

        <div className="mt-10">
          <Header className="text-2xl mb-4">Что включает курс:</Header>
          {course.lessons.map(({number, title, description}) =>
            <Card key={number} header={`${number}. ${title}`}>
              {/* <p>
                {description}
              </p> */}
              
                {description.map((item, index) =>
                  <SimpleCell
                  key={index}
                  before={<MdDone size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
                >
                  {item}
                </SimpleCell>
                )
              }

            </Card>
          )}

          <a
            href="https://t.me/Anna_School_bot"
            className="text-center inline-block bg-gradient-to-r from-[#9e0615] to-[#E55242] text-white font-semibold text-lg px-8 py-4 mb-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            target="_blank"
            rel="noopener noreferrer"
          >
            Предзапись на курс
          </a>
        </div>
      </div>
    </div>
  )
};

export default CoursePage;
