import React from "react";
import { AiFillLike,AiFillDislike,AiFillEye } from "react-icons/ai"

function Comment({ title, titleColor, icon, iconColor, description, likes, styles,dislikes, views}) {
  return (
    <div
      className={`flex flex-col gap-y-7 shadow-md border-2  border-neutral-200 rounded-lg p-4 m-4 w-[250px] ${styles}`}
    >
      <div className="flex justify-between items-center">
      <span className={`text-3xl ${iconColor}`}>{icon}</span>
        <h1 className={`text-neutral-500 ${titleColor} text-xl max-w-[150px]`}>{title}</h1>
      </div>

      <div className="flex justify-center">
       <h4>{description}</h4>
      </div>

      <div className="flex justify-center items-center gap-x-4 ">
      <div className="flex items-center ">
      <AiFillLike />
        <p className="ml-2 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
          {likes}
        </p>
        </div>
        <div className="flex items-center ">
        <AiFillEye />
        <p className="ml-2 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
          {views}
        </p>
        </div>
        <div className="flex items-center ">
        <AiFillDislike />
        <p className="ml-2 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
          {dislikes}
        </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
