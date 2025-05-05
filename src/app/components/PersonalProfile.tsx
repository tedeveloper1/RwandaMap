import { MapPin, Phone, UserCircle2 } from 'lucide-react';
import React from 'react'
import img1 from "../../../public/bg.png";

const PersonalProfile = () => {
  return (
    <div className="w-[500px] bg-white flex-auto translate-y-8 rounded-xl h-[75vh] p-3">
      <div className="image w-full flex items-center justify-center py-5">
        <div className="p-1 bg-green-600 rounded-full">
          <div
            className="imgs bg-center bg-cover w-[150px] h-[150px] rounded-full"
            style={{ backgroundImage: `url(${img1})` }}
          >
            <div className="w-5 h-5 p-2 rounded-full bg-red-600 fixed top-10 right-24 bottom-0 z-20 border-2 border-white"></div>
          </div>
        </div>
      </div>
      <div className="w-full full-names flex items-center justify-center">
        <h1 className="leading-relaxed font-bold text-xl text-green-600">
          Jonathan Beni
        </h1>
      </div>
      <div className="all py-8 flex flex-col gap-y-2 px-3">
        <div className="title flex items-center gap-x-1">
          <UserCircle2 className="text-green-700" />
          <h1 className="text-black leading-relaxed ">CodeJocker</h1>
        </div>
        <div className="tel flex items-center gap-x-1">
          <Phone className="text-green-700" />
          <h1 className="text-black leading-relaxed ">+250 793 637 256</h1>
        </div>
        <div className="location flex items-center gap-x-1">
          <MapPin className="text-green-700" />
          <h1 className="text-black leading-relaxed ">Rwanda</h1>
        </div>
        <div className="bio flex items-center">
          {/* <Info className="text-green-700" /> */}
          <h1 className="text-black leading-relaxed line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam,
            earum excepturi explicabo eos impedit ab saepe perferendis
            temporibus quidem ipsum. Nihil iste blanditiis doloremque delectus,
            iure quis error molestias obcaecati.
          </h1>
        </div>
        <div className="button py-5">
          <button className="bg-green-600 rounded-lg text-white p-2 w-full cursor-pointer hover:bg-green-700 transition-all duration-200">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalProfile