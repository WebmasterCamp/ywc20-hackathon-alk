"use client"

import { authClient } from '@/lib/auth-client';
import { encodeThaiEmail } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AuthPage() {
  const router = useRouter();

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
      
      const { data } = await authClient.signUp.email({
        email: encodeThaiEmail(formData.email),
        password: formData.password,
        name: formData.name,
        image: "",
      });
      if (data) return router.push('/')
    }

    if (!formData.email || !formData.password) return
    const { data } = await authClient.signIn.email({
      email: encodeThaiEmail(formData.email),
      password: formData.password,
    });
    if (data) return router.push('/')
  }

  const googleSignIn = async () => {
      const data = await authClient.signIn.social({
          provider: "google",
      });
      console.log(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FEF8E4] p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isNew ? 'Sign Up' : 'Sign In'}
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
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <button onClick={googleSignIn} className="w-full border py-2 rounded-md hover:bg-gray-100 duration-200 transition-all cursor-pointer">
          เข้าสู่ระบบด้วย Google
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
