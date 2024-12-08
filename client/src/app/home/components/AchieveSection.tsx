import React, { FC } from 'react'

interface AchieveSectionProps {
  achievements: string[]
  header: string
}

const AchieveSection: FC <AchieveSectionProps> = ({achievements, header}) => {
  return (
    <section id="achievements" className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{header}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-slate-800 p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
              <p>{achievement}</p>
            </div>
          ))}
        </div>
    </section>
  )
}

export default AchieveSection