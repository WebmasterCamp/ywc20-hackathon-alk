import React from 'react'

export default function Hero() {
  return (
      <div className="relative flex justify-center h-[600px] bg-[#FEF8E4]">
          <img
              className="absolute top-0 right-0 h-full object-cover"
              src="/monk.svg"
              alt="monk"
          />
          <div className="w-[1200px] flex items-center">
              <div>
                  <h1 className="text-brown-normal font-bold text-4xl">
                      อนุโมทนา
                  </h1>
                  <h1 className="text-brown-normal font-bold text-6xl mt-5">
                      บุญครบถ้วน รับรองอิ่มใจ
                  </h1>
              </div>
          </div>
      </div>
  );
}
