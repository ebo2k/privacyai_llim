import Chat from "all/components/Chat";
import ChatInput from "all/components/ChatInput";
import Dpia from "all/components/Dpia";
import DpiaInput from "all/components/DpiaInput";

type Props= {
    params: {
        id: string;
    }
}
function DpiaPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <p>DPIA Page</p>
        <DpiaInput chatId ={id}/>
        <Dpia dpiaId ={id}/>
        
    </div>
  );
}

export default DpiaPage;