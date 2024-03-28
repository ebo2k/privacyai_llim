import Chat from "all/components/Chat";
import PrivacyRequirementInput from "all/components/PrivacyRequirementInput";

type Props= {
    params: {
        id: string;
    }
}

function PrivacyRequirementPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-grow overflow-y-auto">
            <Chat chatId ={id}/>
        </div>
        <div className="flex-none">
            <PrivacyRequirementInput chatId ={id}/>
        </div>
    </div>
  );
}



export default PrivacyRequirementPage;