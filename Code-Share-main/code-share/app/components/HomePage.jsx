import { randomUUID } from 'crypto';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {v4 as uuidv4} from "uuid";
import toast from 'react-hot-toast';
import { FaCode } from "react-icons/fa6";

function HomePage() {
  const router = useRouter();
  const [roomid,setRoomId] = useState("");
  const [userName,setUserName] = useState("");

  function handleSubmit(e)
  {
    e.preventDefault();
    if(roomid.length > 0 && userName.length > 0)
    {
      const state = { roomId: roomid, name: userName };
      const query = new URLSearchParams(state).toString();
      router.push(`/editor?${query}`);
      // console.log("A")
      // router.push(`/editor/${roomid}`);
    }
    else
    {
      toast.error("All fields are required");
    }
  }

  return (
    <div className='flex justify-center items-center h-full w-full bg-gray-900'>
      <div className='bg-gray-800 w-[90%] md:w-[40%] rounded-lg border p-4 md:p-10'>
        <div className='flex items-center gap-2 justify-center text-4xl font-semibold py-10'>
          {/* <img src="" alt="" /> */}
          <FaCode/> <p>| Code Share</p>
        </div>
        <form onSubmit={handleSubmit} className='flex items-center gap-y-4 flex-col'>
          <p className='text-2xl font-semibold'>Enter Room ID</p>
          <input className='w-full rounded-md px-2 py-2 border-2 border-black text-black' value={roomid} onChange={(e) => {
            setRoomId(e.target.value);
          }} type="text" name="" id="" placeholder='Room ID' />
          <input className='w-full rounded-md px-2 py-2 border-2 border-black text-black' value={userName} onChange={(e)=>{
            setUserName(e.target.value);
          }} type="text" name="" id="" placeholder='Username' />
          <button className='bg-green-600 px-2 py-2 rounded-md font-semibold hover:bg-green-700 transition-all ease-in duration-200'>Join Room</button>
        </form>
        <div className='flex justify-center gap-2 mt-5'>
          <p>Don't have room ID?</p>
          <button onClick={() => {
            setRoomId(uuidv4());
            console.log(uuidv4())
            toast.success("Room id created successfully")
          }} className='text-green-500'>Create Room</button>
        </div>
      </div>
    </div>
  )
}

export default HomePage