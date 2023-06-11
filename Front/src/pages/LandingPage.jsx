import React from "react";
import PrincipalCard from "../components/principalcard";
import { FormattedMessage } from "react-intl";


function ForumPage() {
  return (
    <div>
      <div className="  flex flex-col justify-center w-screen h-screen p-8 sm:p-16 bg-[url('./images/principal.png')] bg-cover bg-no-repeat bg-center ">
        <h2 className="max-w-[450px] text-white text-6xl font-semibold mb-4">
        <FormattedMessage id="CenterPrincipal"/>
        </h2>
        <a
          className=" max-w-[200px] ml-2 bg-orange-500 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
          href="/login"
        >
          <span className="text-lg leading-lg text-white opacity-75 text-center underline w-full">
          <FormattedMessage id="Button"/>
          </span>
        </a>
      </div>
      <div className=" flex justify-center items-center bg-blue-500 w-full h-[50px]">
        <h2 className=" text-white text-3xl font-semibold  ">
        <FormattedMessage id="Question"/>
        </h2>
      </div>
      <div className=" flex flex-col justify-center items-center bg-black w-full">
        <h1 className=" text-white text-3xl font-semibold mt-20">
        <FormattedMessage id="TextRoutines"/>
        </h1>
        <div className=" flex flex-wrap justify-center ">
          <PrincipalCard
            title="Rutina 1"
            description="Sigue esta rutina y veras como crece tu cola"
            styles="bg-slate-700"
            textbutton="Empieza ahora"
          />
          <PrincipalCard
            title="Rutina 2"
            description="Los mejores ejercicios para un abdomen plano"
            styles="bg-slate-700"
            textbutton="Empieza ahora"
          />
          <PrincipalCard
            title="Rutina 3"
            description="Dile no a esas llantas molestas"
            styles="bg-slate-700"
            textbutton="Empieza ahora"
          />
        </div>
        <h1 className="text-white text-3xl font-semibold ">
        <FormattedMessage id="TextExercises"/> 
        </h1>
        <div className="flex flex-wrap justify-center">
          <PrincipalCard
            styles=" bg-[url('./images/card1.png')] bg-cover bg-no-repeat bg-center"
            textbutton="Ejercicio 1"
          />
          <PrincipalCard
            styles=" bg-[url('./images/card2.png')] bg-cover bg-no-repeat bg-center"
            textbutton="Ejercicio 2"
          />
          <PrincipalCard
            styles=" bg-[url('./images/card3.png')] bg-cover bg-no-repeat bg-center"
            textbutton="Ejercicio 3"
          />
        </div>
        <h3 className="text-white text-3xl font-semibold text-center w-full">
        <FormattedMessage id="HE"/>
          <p className="text-white text-xl text-center w-full mb-20 ">
          <FormattedMessage id="Description"/>
          </p>
        </h3>
      </div>
    </div>
  );
}

export default ForumPage;
