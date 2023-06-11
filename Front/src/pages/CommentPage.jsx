import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import Comment from "../components/comment";
import axios from "axios";

function CommentPage() {
  const { foroId } = useParams();
  console.log(foroId)

  const [comments, setComments] = useState([]);
  const token = sessionStorage.getItem('jwtToken');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const getcomments = async () => {
      if (navigator.onLine){ 
      const url = `http://localhost:2000/api/v1/foros/${foroId}/publicaciones`;
      await axios
        .get(url)
        .then((res) => {
          setComments(res.data);
          localStorage.setItem("comments"+foroId, JSON.stringify(res.data))
        })
        .catch((err) => {
          alert("Error " + JSON.stringify(err));
        });
    }
    else {
      if(localStorage.getItem("comments"+foroId)) {
        setComments(JSON.parse(localStorage.getItem("comments"+foroId)));
    }

    }};

    getcomments();
  }, [foroId]);
  

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col">
        <h1 className="text-white text-2xl font-semibold mb-4">
          Comentarios 
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {comments.map((comment) => (
            <Comment
              title={comment.publicador}
              icon={<BsFillPersonFill />}
              iconColor="text-orange-500"
              description={comment.texto}
              likes={comment.numMegusta}
              dislikes={Math.floor(Math.random() * 25) + 1}
              views={Math.floor(Math.random() * 100) + 1}
              styles="bg-neutral-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommentPage;
