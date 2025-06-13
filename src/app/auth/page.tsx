"use client"

import { authClient } from '@/lib/auth-client';
import { encodeThaiEmail } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AuthPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [formLoading, setFormLoading] = useState(false);

  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const clearState = () => {
    setFormData({
      name: "",
      email: "",
      password: ""
    })
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmitForm = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    
    if (isNew) {
      if (!formData.email || !formData.password || !formData.name) return
      
      setFormLoading(true);
      const { data } = await authClient.signUp.email({
        email: encodeThaiEmail(formData.email),
        password: formData.password,
        name: formData.name,
        image: "",
      });
      setFormLoading(false);
      if (data) return router.push('/')
    }

    if (!formData.email || !formData.password) return
    setFormLoading(true);
    const { data } = await authClient.signIn.email({
      email: encodeThaiEmail(formData.email),
      password: formData.password,
    });
    if (data) return router.push('/');
    setFormLoading(false);
  }

  const googleSignIn = async () => {
      const data = await authClient.signIn.social({
          provider: "google",
      });
      console.log(data);
  };

  useEffect(() => {
    if (session) {
      return router.push('/')
    }
  }, [session])

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FEF8E4] p-4">
        <div className='w-96'>
          <img className='w-full object-cover' src="/images/logo.png" alt="logo" />
        </div>
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-normal" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FEF8E4] p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <div className='flex justify-center mb-7'>
          <div className='w-64'>
            <img className='w-full object-cover' src="/images/logo2.png" alt="logo2" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">
          {isNew ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
        </h2>

        <form onSubmit={onSubmitForm} className="space-y-4">
          {isNew && (
            <input
              onChange={onInputChange}
              value={formData.name}
              type="text"
              placeholder="ชื่อ-นามสกุล"
              name='name'
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          )}
          <input
            onChange={onInputChange}
            value={formData.email}
            placeholder="ทดสอบ@ทดสอบ.ไทย"
            name='email'
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            onChange={onInputChange}
            value={formData.password}
            type="password"
            placeholder="รหัสผ่าน"
            name='password'
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {formLoading ? (
            <div 
              style={{
                backgroundColor: isNew
                  ? 'var(--color-brown-normal)'
                  : 'var(--color-yellow-normal)',
              }} 
              className='flex items-center justify-center text-white py-2 rounded-md duration-200'
            >
              <p className='mr-2 text-light'>กำลังเข้าสู่ระบบ</p>
              <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-light" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <button
            type="submit"
            className="w-full text-white py-2 rounded-md duration-200 transition-all cursor-pointer"
            style={{
              backgroundColor: isNew
                ? 'var(--color-brown-normal)'
                : 'var(--color-yellow-normal)',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = isNew
                ? 'var(--color-brown-normal-hover)'
                : 'var(--color-yellow-normal-hover)')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = isNew
                ? 'var(--color-brown-normal)'
                : 'var(--color-yellow-normal)')
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.backgroundColor = isNew
                ? 'var(--color-brown-normal-active)'
                : 'var(--color-yellow-normal-active)')
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.backgroundColor = isNew
                ? 'var(--color-brown-normal-hover)'
                : 'var(--color-yellow-normal-hover)')
            }
          >
            {isNew ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
          </button>
          )}
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <button onClick={googleSignIn} className="flex items-center justify-center w-full border py-2 rounded-md hover:bg-gray-100 duration-200 transition-all cursor-pointer">
          เข้าสู่ระบบด้วย Google
          <div className='w-5 ml-2'>
            <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
          </div>
        </button>

        <p className="text-center text-sm mt-6">
          {isNew ? (
            <>
              มีบัญชีอยู่แล้วใช่ไหม?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setIsNew(false);
                  clearState();
                }}
              >
                เข้าสู่ระบบ
              </span>
            </>
          ) : (
            <>
              ยังไม่มีบัญชีใช่ไหม?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setIsNew(true)
                  clearState();
                }}
              >
                ลงทะเบียน
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
