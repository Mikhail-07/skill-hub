"use client"

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useStores } from "@/store/MobXProvider";
import MyInput from '../../components/MyInput';
import Card from '../../components/Card';
import { login, registration } from '@/api/userAPI';

const AuthPage = () => {
  const { user } = useStores();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    name: '',
    surname: ''
  });

  console.log(isLogin)

  const handleChange = (field: string, value: string) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      let data
      if (isLogin) {
        data = await login(formValues);
      } else {
        data = await registration(formValues);
      }
      user.setUser(data);
      user.setAuth(true);
      router.push('/home');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card header={isLogin ? 'Авторизация' : 'Регистрация'} mode="dark" className="w-full max-w-md">
        <form className="flex flex-col space-y-4">
          <MyInput
            label="Email"
            value={formValues.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="Введите email"
            // type="email"
            required
          />
          <MyInput
            label="Пароль"
            value={formValues.password}
            onChange={(value) => handleChange('password', value)}
            placeholder="Введите пароль"
            // type="password"
            required
          />
          {!isLogin && (
            <>
              <MyInput
                label="Имя"
                value={formValues.name}
                onChange={(value) => handleChange('name', value)}
                placeholder="Введите имя"
                required
              />
              <MyInput
                label="Фамилия"
                value={formValues.surname}
                onChange={(value) => handleChange('surname', value)}
                placeholder="Введите фамилию"
                required
              />
            </>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-400">
              {isLogin ? (
                <>
                  Нет аккаунта?{' '}
                  <button onClick={() => setIsLogin(false)} type="button" className="text-blue-500 hover:underline">
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button onClick={() => setIsLogin(true)} type="button" className="text-blue-500 hover:underline">
                    Войти
                  </button>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;
