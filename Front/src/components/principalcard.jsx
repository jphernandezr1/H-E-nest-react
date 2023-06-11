import React from "react";

function PrincipalCard({ title, titleColor, icon, iconColor, description, styles,textbutton}) {
  return (
    <div
      className={`flex justify-evenly flex-col gap-y-7 shadow-md border-neutral-200 p-4 m-4 w-[250px] h-[300px] ${styles}`}
    >
      <div className="flex justify-center items-center">
      <span className={`text-3xl ${iconColor}`}>{icon}</span>
        <h1 className={`text-white ${titleColor} text-xl max-w-[150px]`}>{title}</h1>
      </div>

      <div className="flex justify-center">
       <h4 className="text-white">{description}</h4>
      </div>

      <div className="flex justify-center">
      <a
          className=" max-w-[200px] ml-2 bg-blue-500 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
          href="/empezar"
        >
          <span className="text-lg leading-lg text-white opacity-75 text-center underline w-full">{textbutton}
          </span>
        </a>
      </div>
    </div>
  );
}

export default PrincipalCard;
