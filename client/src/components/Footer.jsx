import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/img/logo.png";
// import react icons
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram, BsYoutube, BsTwitter, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  const checkUI = window.location.href;

  return (
    <div
      className={`w-full bg-[#242424] flex flex-col justify-center items-center text-center pt-16 pb-7 ${
        checkUI.includes("admin") && "hidden"
      }`}
    >
      <div className="container flex flex-col justify-center items-center text-center text-white">
        <h3 className="text-center text-2xl mb-3">
          Join the Adventure newsletter to receive our best vacation deals
        </h3>
        <p className="text-lg">You can unsubscribe at any time.</p>
        <form
          action=""
          className="w-full md:max-w-xl grid grid-cols-1 md:grid-cols-3 gap-5 my-5 px-16"
        >
          <div className="w-full md:col-span-2 flex justify-center items-center">
            <input
              className="w-full rounded border-none outline-none py-3 px-4 text-stone-700"
              type="email"
              name="email"
              placeholder="Your email ..."
            />
          </div>
          <div className="w-full md:col-span-1 flex justify-center items-center">
            <button className="w-full bg-transparent hover:bg-white text-white font-semibold hover:text-stone-700 py-3 px-4 border border-white hover:border-transparent rounded">
              Subcribe
            </button>
          </div>
        </form>

        <div className="w-full lg:w-4/5 text-center text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16 mb-10">
          <div className="lg:text-start">
            <h3 className="text-xl font-medium mb-3">About Us</h3>
            <ul className="text-base font-light leading-loose">
              <li>
                <Link to="/sign-up">How it works</Link>
              </li>
              <li>
                <Link to="/">Testimonials</Link>
              </li>
              <li>
                <Link to="/">Careers</Link>
              </li>
              <li>
                <Link to="/">Investors</Link>
              </li>
              <li>
                <Link to="/">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="lg:text-start">
            <h3 className="text-xl font-medium mb-3">Contact Us</h3>
            <ul className="text-base font-light leading-loose">
              <li>
                <Link to="/">Contact</Link>
              </li>
              <li>
                <Link to="/">Support</Link>
              </li>
              <li>
                <Link to="/">Destinations</Link>
              </li>
              <li>
                <Link to="/">Sponsorships</Link>
              </li>
            </ul>
          </div>
          <div className="lg:text-start ">
            <h3 className="text-xl font-medium mb-3">Videos</h3>
            <ul className="text-base font-light leading-loose">
              <li>
                <Link to="/">Submit Video</Link>
              </li>
              <li>
                <Link to="/">Ambassadors</Link>
              </li>
              <li>
                <Link to="/">Agency</Link>
              </li>
              <li>
                <Link to="/">Influencer</Link>
              </li>
            </ul>
          </div>
          <div className="lg:text-start">
            <h3 className="text-xl font-medium mb-3">Social Media</h3>
            <ul className="text-base font-light leading-loose">
              <li>
                <Link to="/">Instagram</Link>
              </li>
              <li>
                <Link to="/">Facebook</Link>
              </li>
              <li>
                <Link to="/">Youtube</Link>
              </li>
              <li>
                <Link to="/">Twitter</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full text-center text-white grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="w-full flex justify-center items-center">
            <Link
              className="w-fit text-4xl flex flex-col justify-center items-center md:flex-row"
              to=""
            >
              <img className="w-16" src={logo} alt="Hoàng Long Technology" />
              <h2 className="block text-lg uppercase font-semibold">
                Hoàng Long Technology
              </h2>
            </Link>
          </div>
          <div className="w-full flex justify-center items-center text-center text-3xl gap-7">
            <Link to="/" target="_blank" aria-label="Facebook">
              <FaFacebookF />
            </Link>
            <Link to="/" target="_blank" aria-label="Instagram">
              <BsInstagram />
            </Link>
            <Link to="/" target="_blank" aria-label="Youtube">
              <BsYoutube />
            </Link>
            <Link to="/" target="_blank" aria-label="Twitter">
              <BsTwitter />
            </Link>
            <Link to="/" target="_blank" aria-label="LinkedIn">
              <BsLinkedin />
            </Link>
          </div>
          <div className="flex justify-center items-center text-lg font-semibold lg:col-span-2">
            Copyright © 2023 &nbsp;
            <Link to="https://www.facebook.com/EtasyCandy.Os">EtasyCandy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
