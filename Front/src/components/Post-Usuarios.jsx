import "./Card.css"; // Archivo CSS con las clases de estilo personalizadas.
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

function PostUser(props) {
  return (
    <Link to={props.link} className="h-fit">
      <div className="card-size">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <img class="h-10 w-10 rounded-full" src="https://i.pinimg.com/474x/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.jpg" alt="User Avatar" />
            <div class="ml-4">
              <h2 class="text-lg font-semibold">{props.name}</h2>
            </div>
          </div>
          <div class="mt-4">
            <div className="row">
              <h3><FormattedMessage id="mail"/> {props.correo}</h3>
              <h3><FormattedMessage id="bdate"/> {props.fecha}</h3>
            </div>      
          </div> 
        </div>
      </div>
    </Link>
  );
 }
 
 export default PostUser;