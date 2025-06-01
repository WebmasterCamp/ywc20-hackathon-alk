import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-brown-darker text-white py-10 pl-[145px] pr-[145px] w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                <p className="text-sm">Copyright © 2020 Nexcant ltd.</p>
                <p className="text-sm">All rights reserved</p>
                <div className="flex space-x-4 pt-2">
                    <a href="#"><img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6" /></a>
                    <a href="#"><img src="/icons/dribbble.svg" alt="Dribbble" className="w-6 h-6" /></a>
                    <a href="#"><img src="/icons/twitter.svg" alt="Twitter" className="w-6 h-6" /></a>
                    <a href="#"><img src="/icons/youtube.svg" alt="YouTube" className="w-6 h-6" /></a>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Testimonials</a></li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-sm">
                    <li><a href="#">Help center</a></li>
                    <li><a href="#">Terms of service</a></li>
                    <li><a href="#">Legal</a></li>
                    <li><a href="#">Privacy policy</a></li>
                    <li><a href="#">Status</a></li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Stay up to date</h3>
                <form className="flex bg-[#3E342F] rounded px-4 py-2 items-center space-x-2">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="bg-transparent outline-none text-sm placeholder-gray-300 flex-1"
                    />
                    <button type="submit">
                    </button>
                </form>
            </div>
        </div>
    </footer>
  )
}
