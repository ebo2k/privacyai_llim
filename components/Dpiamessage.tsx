import { DocumentData} from "firebase/firestore"

type Props = {
    message: DocumentData;
}

function Dpiamessage({message} : Props) {
    const isChatGPT = message.user.name === "ChatGPT";
  return (
  <div className ={`py-5 border-t border-2 border-b border-gray-200 ${isChatGPT && "bg-gray-100"}`}>
    <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <img src = {message.user.avatar} alt ="" className="h-8 w-8"/>
        <p className="pt-1 text-sm">
            {message.text}
        </p>
    </div>
  </div>
  );
}

export default Dpiamessage;