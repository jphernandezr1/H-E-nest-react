import "./Card.css"; // Archivo CSS con las clases de estilo personalizadas.
import { useState } from "react";
import { FormattedMessage } from "react-intl";


function Post(props) {
  const [followers, setFollowers] = useState(props.followers);
 
  const renderFollower = () => {
    if (followers === 0) return "Aun nadie lo sigue, siguelo";
    else return  followers;
  };
 
  const handleFollowers = () => {
    console.log("Button clicked...");
    setFollowers(followers + 1);
  };
 
  return (
    <div className="card-size">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center">
          <img class="h-10 w-10 rounded-full" src="https://i.pinimg.com/474x/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.jpg" alt="User Avatar" />
          <div class="ml-4">
            <h2 class="text-lg font-semibold">{props.name}</h2>
            <p class="text-gray-500">Basic User</p>
          </div>
        </div>
        <div class="mt-4">
          <div className="row">
            <h2>{props.nombreMet}: {renderFollower()}</h2>
            <h2><FormattedMessage id= "eHours"/> {props.hours}</h2>
          </div>      
          <div class="container-1">
            <button className="btn btn-primary" onClick={handleFollowers}>Seguir</button>
          </div>
         </div> 
      </div>
    </div>

  );
 }
 
 export default Post;