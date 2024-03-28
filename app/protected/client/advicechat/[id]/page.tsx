import Chat from "all/components/Chat";
import AdviceInput from "all/components/AdviceInput";

type Props= {
    params: {
        id: string;
    }
}

function AdvicePage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <Chat chatId ={id}/>
        <AdviceInput chatId ={id}/>
    </div>
  );
}

export default AdvicePage;