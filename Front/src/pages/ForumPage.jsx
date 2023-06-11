import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdForum } from "react-icons/md";
import Forum from "../components/forums";
import { FormattedMessage } from "react-intl";
function ForumPage() {
  const [foros, setForos] = useState([]);
  const token = sessionStorage.getItem('jwtToken');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const getforos = async () => {
      if (navigator.onLine){ 
        const url = "http://localhost:2000/api/v1/foros";
        await axios
          .get(url)
          .then((res) => {
            setForos(res.data);
            localStorage.setItem("foros", JSON.stringify(res.data))
          })
          .catch((err) => {
            alert("Error " + JSON.stringify(err));
          });

      }
      else {
        if(localStorage.getItem("foros")) {
          setForos(JSON.parse(localStorage.getItem("foros")));
      }

      }
    };
  
      getforos();
    }, []);

    

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col">
        <h1 className="text-white text-2xl font-semibold mb-4">
          <FormattedMessage id="Forumtitle"/>
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {foros.map((foro) => (
            <Forum
              link={foro.id}
              title={foro.titulo}
              titleColor="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-500"
              icon={<MdForum />}
              iconColor="text-blue-700"
              img
              update={foro.numPublicaciones}
              styles="bg-neutral-50"
            />
          ))}
 
        </div>
      </div>
    </div>
  );
}

export default ForumPage;
