"use client"

import Link from "next/link";
import Card from "@/components/Card";
import SimpleCell from "@/components/SimpleCell";
import { TbFileCertificate } from "react-icons/tb";
import Header from "@/components/Header";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { MdDone } from "react-icons/md";
import Accordion from "@/components/Accordion";
import AccordionItem from "@/components/AccordionItem";
import { FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import SocialButton from "@/components/SocialButton";
import { IoEarth } from "react-icons/io5";
import { RiLink } from "react-icons/ri";
import { useEffect, useState } from "react";
import ModalWindow from "@/components/ModalWindow";
import RegistrationForm from "@/components/RegistrationForm";
import { FiChevronDown } from "react-icons/fi";

export default function Home() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isCertifyModalOpen, setIsCertifyModalOpen] = useState(false);

  const withWhom = [
    {
      header: 'Поиск и определения самореализации',
      description: 'Как себя реализовать, если многое нравится, или наоборот, не знаете, что нравится'
    },
    {
      header: 'Планирование',
      description: 'Трудоголизм, баланс работа / отдых'
    },
    {
      header: 'Отношения',
      description: 'Как улучшить отношения с супругом, детьми, коллегами, друзьями'
    },
    {
      header: 'Повышение дохода',
      description: 'Как выйти на новый уровень в найме и предпринимательстве, сохранив себя'
    },
    {
      header: 'Поиск себя',
      description: 'В чем моя уникальность? Кто я? Про что я? Что я хочу? Куда я иду?'
    }
  ]
  const priceCards = [
    {
      header: 'Разовая сессия',
      price: '5000 ₽',
      description: 'Идеально подходит для знакомства с коучингом и получения первых результатов',
      includes: ['Установочная сессия на 20 минут', 'Коуч сессия длительностью 60 минут']
    },
    {
      header: 'Пакет малый',
      price: '9500 ₽',
      oldPrice: '10000 ₽',
      description: 'Отличный вариант, если вы чувствуете, что решение вашей проблемы близко, но вам нужна помощь, чтобы его увидеть',
      includes: ['Установочная сессия на 20 минут', 'Две коуч сесси длительностью по 60 минут']
    },
    {
      header: 'Пакет базовый',
      price: '18000 ₽',
      oldPrice: '20000 ₽',
      description: 'Оптимальное количество сессий для достижения конкретных целей. У нас будет достаточно времени для детальной проработки вашей ситуации',
      includes: ['Установочная сессия на 20 минут', 'Четыре коуч сесси длительностью по 60 минут']
    },
    {
      header: 'Пакет максимальный',
      price: '36000 ₽',
      oldPrice: '40000 ₽',
      description: 'Для тех, кто хочет глубоко проработать свою проблему. Мы сможем рассмотреть и разобраться в различных аспектах вашей ситуации',
      badge: true,
      includes: ['Установочная сессия на 20 минут', 'Восемь коуч сесси длительностью по 60 минут']
    }
  ]
  const priceLight = [
    {
      header: '2 сессии',
      price: '9500 ₽',
      oldPrice: '10000 ₽',
    },
    {
      header: '4 сессии',
      price: '18000 ₽',
      oldPrice: '20000 ₽',
    },
    {
      header: '8 сессий',
      price: '36000 ₽',
      oldPrice: '40000 ₽',
    }
  ]
  const accordionItems = [
    {
      title: 'Как проходит сессия?',
      content: 'В назначенное время мы связываемся с вами по видео-связи, и обсуждаем ваш запрос. Если вам тяжело определить запрос, я вам в этом помогаю. В процессе обсуждения я помогаю вам сконтейнировать ваши мысли и чувства и найти ответ.'
    },
    {
      title: 'Что такое установочная сессия?',
      content: 'Это сессия-знакомство, она же ознакомительная - первая встреча, цель которой – знакомство коуча и клиента. Это своеобразное «первое свидание», когда коучу и клиенту предстоит понять, насколько они подходят друг другу и договориться обо всех деталях будущего взаимодействия. Подготавливаться к установочной сессии не нужно.'
    },
    {
      title: 'Конфиденциальность',
      content: 'Я сохраняю тайну наших сессий и обсуждаемых тем между мной и клиентом.'
    },
    {
      title: 'Подходит ли мне коучинг?',
      content: 'После установочной сессии мы выясняем, подходит ли вам коучинг, или же вам необходим другой специалист.'
    },
    {
      title: 'Если я не доволен результатом',
      content: 'Если вы не довольны результатом сессии и ваш запрос не был решен, я произвожу возврат средств за не израсходованные сессии.'
    }
  ]
  const achievements = [
    'Хореограф и актриса сериала «1703» (Лучший сериал 2022г)',
    'Танцор в клипе KAYA «Контент»',
    'Танцор в клипе Лады Денс «Алеша»',
    'Танцор в клипе Николая Баскова «Сердце на сердце»',
    'Танцор в клипе Little Big «Скибиди2»',
    'Танцор в клипе Джонни Фунт «Яд»',
    "Актриса и хореограф-постановщик в клипе Big Russian Boss «Не виновен»",
    "Актриса в короткометражном фильме «МИРАЖИ»",
    "Номинация на лучшую женскую роль на Римском кинофестивале",
    "Спикер и педагог по модельной походке и позингу в школе аниматоров «Море шоу»",
    "Танцор основного балета мероприятия «В один голос» Олимпийский 22, 23, 24 марта 2018г.",
    "Танцор в клипе Ольги Бузовой «Если ты не мужчина, а wifi»",
    "Танцор ТАНЦЫ НА ТНТ Презентация трека Ольги Бузовой «Если ты не мужчина, а wifi»",
    "Хореограф Артема Пивоварова на шоу BIG RUSSIAN BOSS новогодний выпуск «Под шубой»",
    "Хореограф сольного концерта АРЦВИК Градский Холл 28.10.2017г.",
    "Танцор основного балета на TOP DISCO POP2 г. Москва. Работала с Ольгой Бузовой, Тимуром Родригесом, Владом Соколовским, Еленой Вебер, группой ФАБРИКА",
    "Судья крупнейшего в СНГ фестиваля фантастики, кино и науки СТАРКОН 2017г.",
    "Модель и танцор на показе бренда OPIUM (Ленинград Центр) 2017г. Открывала и закрывала показ",
    "Гость в передаче КЛИККЛАК выпуск про Vogue",
    "Судья Vogue Ball при фестивале NOGI v RUKI Ярославль 2016г.",
    "Судья Grodno Vogue Ball 2016. Back In USSR",
    "Танцор в клипе Ивана Дорна «Ты всегда в плюсе» 2016",
    "Гость в передаче «Пани пробуют» ходить на каблуках. Преподаватель модельной походки",
    "Судья всероссийского танцевального конкурса «Русские звезды» 2016 г. Санкт-Петербург",
    "Модель дизайнера Анастасии Капранчик. Каталог весна-лето 2016",
    "Модель и танцор на Недели Моды в Санкт-Петербурге, дизайнера Arny Praht 2015. Открывала и закрывала показ",
    "Модель на Открытом Международном Чемпионате «Невские Берега» 2015",
    "Преподаватель модельной походки и фотопозирования в модельной школе «GMS Models» с 2014г.",
    "Создатель и организатор летнего танцевального лагеря «VOGUE ACADEMY RUSSIA» 2014, 2015",
    "Организатор танцевального фестиваля по абстракту и эксперименталу «Мнимая Единица» 2014 г. (г. Санкт-Петербург)",
    "Участник шоу MOVING POETRY PRO 2014",
    "Танцор клипа Matisse & Sadko «Azonto»",
    "Танцор основного шоу «Pirate Station» 2014г.",
    "Судья отбора «Teamka Magadan» 2012г.",
    "Сопродюсер танцевального центра «ONLINE» г. Магадан 2011г.",
    "Хореограф и создатель танцевального коллектива «ТОЧКИ», многократные победители областных и городских конкурсов 2007-2011г. Магадан"
  ];
  const danceAchieve = [
    "Победитель Runway на «Moulin Rouge Vogue Ball» 2019",
    "Финалист Old way на «Moulin Rouge Vogue Ball» 2019",
    "Победитель категории «Я против музыки» Vogue Ball «Питер в огне» 2017",
    "Победитель категории Production «Christmas Vogue Ball» 2016",
    "Полуфиналист категории Femm Vogue на «Christmas Vogue Ball» 2016",
    "Полуфиналист категории Runway «The East Is Red Vogue Ball» 2015",
    "Финалист категории Old Way «North Venice Vogue Ball» 2014г.",
    "Полуфиналист категории Hands Perfomance «North Venice Vogue Ball» 2014",
    "Финалист категории Runway «North Venice Vogue Ball» 2013",
    "Гранд приз Perfomance Face vs Prop «Divine Vogue Ball» 2013",
    "Победитель Perfomance with a Prop – «Divine Vogue Ball» 2013",
    "Полуфиналист в категории Femme Vogue – «Christmas Vogue Ball» 2013",
    "Полуфиналист в категории HipHop «UDS Fest» Магадан 2012",
    "Победитель в категории HipHop «Unidance Battle» Магадан 2011"
  ];

  const [scrollY, setScrollY] = useState(0);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const shrinkFactor = Math.max(0, 1 - scrollY / 5000);
  const opacityFactor = Math.max(0, 1 - scrollY / 2000);
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <ModalWindow
        onClose={() => setIsFormModalOpen(false)}
        isOpen={isFormModalOpen}
      >
        <RegistrationForm
          isFormModalOpen={ isFormModalOpen }
          onClose={() => setIsFormModalOpen(false)}
        />
      </ModalWindow>
      <div className="h-screen-lvh py-4 mb-14 relative">
        <div className="fixed z-10 max-w-7xl mx-auto h-full inset-x-0 px-4 " style={{ transform: `scale(${shrinkFactor})`, opacity: opacityFactor }}>
          <div className="flex flex-col h-full md:flex-row md:items-center justify-between rounded-3xl mb-6 relative">
            <div className="mb-2 md:mb-0 relative md:w-1/2 w-full h-full md:order-2 overflow-hidden">
              <img
                src="/hero.webp"
                alt="Vertical Photo"
                className="rounded-3xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>
            <div className="w-full flex flex-col justify-center md:w-1/2 space-y-4 md:mb-0 md:order-1 md:static absolute h-full  p-4">
              <div className="text-4xl md:text-6xl font-bold space-y-2">
                <p>Анна</p>
                <p>Царева</p>
              </div>
              <p className="text-lg">Сертифицированный коуч ICF</p>
              <button
                className="text-center inline-block bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
                onClick={() => setIsFormModalOpen(true)}
              >
                Записаться на сессию
              </button>
              <Link href="/courses/2" passHref>
                <button className="text-center inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                  Перейти на курс
                </button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-4 z-10 inset-x-0 flex justify-center">
            <div className="animate-bounce text-white">
              <FiChevronDown className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 rounded-t-3xl relative z-20">
        <div>
          <Card header="Обо мне">
            <SimpleCell
              before={<IoEarth size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>Сертификат ICF</Header>}
            >
              <div>
                <p className="mb-4">Сертифицированный коуч ICF (Международная федерация коучей)</p>
                <div
                  className="relative cursor-pointer w-24 h-full"
                  onClick={() => setIsCertifyModalOpen(true)}
                >
                  <img
                    src='/certify.webp'
                    alt="Thumbnail"
                    className="w-full h-auto object-cover rounded"
                  />
                </div>
              </div>
              <ModalWindow 
                onClose={() => setIsCertifyModalOpen(false)}
                isOpen={isCertifyModalOpen}
              >
                <div className="max-w-screen max-h-screen overflow-auto">
                  <img
                    src='/certify.webp'
                    alt="Full-size image"
                    className="w-auto h-auto object-contain rounded"
                  />
                </div>
              </ModalWindow>
            </SimpleCell>
            <SimpleCell
              before={<TbFileCertificate size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>Дипломированный коуч РФ</Header>}
            >
              Квалифицированный профессиональный коуч
            </SimpleCell>
            <SimpleCell
              before={<HiOutlineAcademicCap size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>Окончила международную академию трансперсонального коучинга</Header>}
            >
              Владею классическим коучингом, коучингом ICF и трансперсональным коучингом
            </SimpleCell>
            <SimpleCell
              before={<FaArrowTrendUp  size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>Повышаю квалификацию</Header>}
            >
              Курсы, семинары, проф. переподготовки
            </SimpleCell>
            <SimpleCell
              before={<LiaHandsHelpingSolid size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>Регулярные супервизии и личная терапия</Header>}
            >
              Работаю на регулярной основе с супервизором и личным коучем
            </SimpleCell>
          </Card>
        </div>
        <div className="flex  md:gap-10 md:flex-nowrap items-center flex-wrap">
          <div className="relative w-screen md:w-1/2 md:mx-0 h-96 -mx-4  mb-8 md:order-2">
            <img
              src='/hero2.jpeg'
              alt="Vertical Photo 2"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="mb-8 md:w-1/2">
            <p className="mb-6">
              На протяжении 18 лет тренировала танцоров, выращивала из них лидеров, педагогов, чьи работы как сольных артистов, так и постановщиков вы видите на экранах федеральных каналов, кино, а также на различных шоу самых разных форматов.
            </p>
            <Link href="#achievements" className="flex items-center mb-6">
              <RiLink size={24} style={{ color: 'rgb(6, 182, 212)' }} className="mr-2 w-16"/>
              <span className=" text-cyan-500">
              Мои личные достижения, победы и подробную мою работу вы можете прочесть тут.
              </span>
            </Link>
            
            <p className="mb-6">
              Я знаю все о вопросах реализации потенциала, достижениях своих целей и улучшении качества своей жизни и через коучинг помогаю другим людям в работе над собой.
            </p>
          </div>
        </div>
        <Card header="С чем я работаю">
          {withWhom.map(({header, description}) => 
            <SimpleCell
              key={header}
              before={<MdDone size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
              header={<Header>{header}</Header>}
            >
              {description}
            </SimpleCell>
          )}
          <button 
            // href={waSession}
            onClick={() => setIsFormModalOpen(true)} 
            className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
          >
            Записаться на сессию
          </button>
        </Card>
        <Card header="Бесплатная установочная сессия">
          <div>
            <p className="pb-2">
              Для новых клиентов я провожу бесплатную установочную сессию, на которой мы с Вами знакомимся, я рассказываю о принципах коучинга, о формате работы, отвечаю на все Ваши вопросы и помогаю Вам определить ваш запрос. И только после знакомства и установочной сессии мы записываемся на рабочую сессию.
            </p>
            <p className="pb-2">
              Длительность установочной сессии 30 минут.
            </p>
          </div>
          <button 
            // href={waOptionSession}
            onClick={() => setIsFormModalOpen(true)} 
            className="inline-block text-center bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
           >
            Записаться на установочную сессию
          </button>
        </Card>
        <div>
          <h1 className="text-4xl mb-3">Цены</h1>
          <Card>
            <SimpleCell
              before={<Header>Разовая сессия</Header>}
            >
              <Header className="text-2xl">5000 ₽</Header>
            </SimpleCell>
            <Header className="mb-4">Действует акция на покупку пакетов сессий</Header>
            <div className="flex flex-col md:flex-row md:gap-10 flex-wrap">
              {priceLight.map(({header, price, oldPrice}) => 
              <div
                key={header}
                className="flex gap-8 mb-6"
              >
                <Header>{header}</Header>
                <div className="flex flex-col gap-4">
                  <div>
                    <Header className="text-2xl">{price}</Header>
                  </div>
                  <div className="relative inline-block">
                    <span className="text-lg font-semibold">
                      {oldPrice}
                    </span>
                    <span className="absolute inset-0 transform rotate-12 bg-gray-500 h-0.5 top-3"></span>
                  </div>
                </div>
                
              </div> 
              )}
            </div>
            <p className="mb-2">‌Цены на пакеты действуют единоразовым платежом.</p>
            <p className="mb-2"> ‌Длительность сессии — 60 минут</p>
            <button 
              // href={waSession}
              onClick={() => setIsFormModalOpen(true)} 
              className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
            >
              Записаться на сессию
            </button>
          </Card>
        </div>
        <Accordion>
          {accordionItems.map(({title, content}) =>
            <AccordionItem key={title} title={title}>
              <p>{content}</p>
            </AccordionItem>
          )}
        </Accordion>
        <div className="flex flex-wrap justify-around">
          <Card>
            <div className="flex items-center gap-5">
              <Header>Остались вопросы?</Header>
              <Link 
                href="https://t.me/AnnaTsareva1" 
                passHref 
                className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Спросить
              </Link>
            </div>
          </Card>
          <Card>
            <div className="flex flex-wrap md:flex-nowrap justify-center lg:justify-start gap-5">
              <div className="h-full flex items-center justify-center w-full md:w-1/3">
                <div className="w-full max-w-52 max-h-full aspect-square rounded-full overflow-hidden">
                  <img
                    src='/avatar.jpg'
                    alt="Avatar"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between w-full gap-5 ">
                <div className="">
                  <Header>Мой блог в Telegram</Header>
                  <div>
                    <p>В нем я делюсь тем, что не публикуется в других медиа</p>
                    <p>Много интересного про коучинг, психологию и отношения</p>
                  </div>
                </div>
                <div className="flex gap-5 justify-center md:justify-between flex-wrap md:flex-nowrap  ">
                  <div className="flex gap-4 justify-between self-center">
                    <SocialButton 
                      url="https://t.me/AnnaTsareva1" 
                      icon={ <FaTelegramPlane size={24}/> }
                    />
                    <SocialButton 
                      url="https://www.instagram.com/annatsareva1"
                      icon={ <FaInstagram size={24}/> }
                    />
                    <SocialButton 
                      url="#"
                      icon={ <FaTiktok size={24}/> }
                    />
                  </div>
                  <Link href="https://t.me/annatsareva" className="inline-block w-full md:w-30 text-center bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition">
                    + Подписаться
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block lg:w-1/3">
                <Link href="https://t.me/annatsareva" passHref>
                  <img
                    className="w-full max-w-52 object-contain"
                    src='/qrCode.svg'
                    alt="QR Code"
                  />
                </Link>
              </div>
            </div>
          </Card>
          <section id="achievements" className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">Мои заслуги, работа и медийность</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-slate-800 p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <p>{achievement}</p>
                  </div>
                ))}
              </div>
          </section>
          <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Участие в танцевальных соревнованиях</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {danceAchieve.map((achievement, index) => (
                <div key={index} className="bg-slate-800 p-4 shadow-md rounded-lg transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <p>{achievement}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
        
    </main>
  );
}
