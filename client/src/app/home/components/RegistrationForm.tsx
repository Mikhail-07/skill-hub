"use client"

import React, { FC, useEffect, useRef, useState, MouseEvent  } from 'react'
import Card from '../../../components/Card'
import MyInput from '../../../components/MyInput'
import RegistrationNotice from './RegistrationNotice'
import Spinner from '../../../components/Spinner'
import emailjs from 'emailjs-com';
import InputMask from 'react-input-mask';


interface RegistrationFormProps{
  isFormModalOpen: boolean;
  onClose: () => void
}

const RegistrationForm: FC<RegistrationFormProps> = ({isFormModalOpen, onClose}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+7 ___ ___ __ __ ')
  const [tgName, setTgName] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sendingError, setSendingError] = useState(false)
  const [sendingSuccessful, setSendingSuccessful] = useState(false)


  const phoneInputRef = useRef<HTMLInputElement>(null);

  const closeForm = () => {
    setName('')
    setPhone('')
    setTgName('')
    setErrorMessage('')
    setSendingSuccessful(false)
    setSendingError(false)
  }

  useEffect (() => {
    if (phoneInputRef.current){
      phoneInputRef.current.focus()
    }
  }, [isFormModalOpen])
  
  const sendMail = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = formValidate();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
        const templateParams = {
            name: name,
            phone: phone,
            tgName: tgName,
        };

        const response = await emailjs.send(
            'service_jz3a7tf',        
            'template_p20nxee',        
            templateParams,
            'lS9_9NMt0oP_D-4sN'             
        );

        console.log('Email sent successfully!', response.status, response.text);
        setName('');
        setPhone('+7 ___ ___ __ __ ');
        setTgName('');
        setSendingSuccessful(true);
    } catch (error) {
        setSendingError(true);
        console.error('Error sending email:', error);
        console.log('Failed to send email.');
    } finally {
        setIsLoading(false);
    }
  };
  

  const formValidate = () => {
    if (!name) {
      setErrorMessage('Введите имя');
      return false;
    }
    if (!phone || phone.length < 16) {
      setErrorMessage('Телефон введен некорректно');
      return false;
    }
    if (!isChecked) {
      setErrorMessage('Для отправки заявки вы должны дать разрешение на обработку персональных данных');
      return false;
    }
    setErrorMessage('');
    return true;
  }
  return (
    <Card header="Заполните форму">
          {sendingSuccessful || sendingError ?
            <RegistrationNotice
              success={sendingSuccessful}
              failed={sendingError}
              onClose={onClose}
            />
          :
            <form className="">
              <div className='mb-2'>
                Ответ придет в течении суток
              </div>
              <MyInput
                label="Имя и Фамилия"
                value={name}
                onChange={setName}
                placeholder="Введите ваше имя"
                required={true}
              />
              <div className="flex flex-col ">
                <label className="mb-2 text-sm font-medium text-white">
                  Телефон 
                  <span className='text-red-400'> *</span>
                </label>
                <InputMask
                  mask="+7\ 999 999 99 99" 
                  maskChar="_"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder='+7 ___ ___ __ __ '
                  className="px-4 mb-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {/* <MyInput
                label="Телеграмм аккаунт"
                value={tgName}
                onChange={setTgName}
                placeholder="Введите ваш tg"
              /> */}
              <div className="mb-4">
                <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                  <span className="ml-2 ">
                    Я согласен(а) на обработку моих персональных данных в соответствии с <a href="/privacy-policy" target="_blank" className="text-cyan-500"> политикой конфиденциальности</a>.
                  </span>
                </label>
              </div>
              {errorMessage && 
                <div className="mb-4 text-red-400">
                  <span>{errorMessage}</span>
                </div>
              }
              {isLoading ?
                <Spinner/>
              :
                <button onClick={(e) => sendMail(e)} className=" inline bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition">
                  Записаться на сессию
                </button>
              }
            </form>
          }
        </Card>
  )
}

export default RegistrationForm