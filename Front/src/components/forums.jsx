import React from "react";
import { Link } from "react-router-dom";

function Forum({ link, title, titleColor, icon, img, update, styles }) {
  return (
    <Link
      to={link}
      className={`flex justify-evenly flex-col gap-y-7 shadow-md border-2  border-neutral-200 rounded-lg p-4 m-4 w-[250px] ${styles}`}
    >
      <div className="flex justify-between items-center">
        <h1 className={`${titleColor} text-xl max-w-[150px]`}>
          {title}
        </h1>
        <span className={`text-3xl text-orange-500`}>{icon}</span>
      </div>
      <div className="flex justify-center">
        {/* <img src={img} alt="body img" className="" /> */}
        {img && <span className="text-8xl text-orange-500">{icon}</span>}
      </div>

      <div>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500">
          {update}
        </p>
      </div>
    </Link>
  );
}

export default Forum;
