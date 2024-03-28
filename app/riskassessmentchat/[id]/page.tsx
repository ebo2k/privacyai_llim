import Chat from "all/components/Chat";
import RiskAssessmentInput from "all/components/RiskAssessmentInput";

type Props= {
    params: {
        id: string;
    }
}

function RiskAssessmentPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <Chat chatId ={id}/>
        <RiskAssessmentInput chatId ={id}/>
    </div>
  );
}

export default RiskAssessmentPage;