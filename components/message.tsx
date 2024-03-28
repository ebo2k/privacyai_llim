import React from 'react';
import parse from 'html-react-parser';
import { DocumentData} from "firebase/firestore"

type Props = {
    message: DocumentData;
}

function Message({message, isLast} : Props & { isLast?: boolean }) {
    const isChatGPT = message.user.name === "ChatGPT";
    const parsedText = parse(message.text);

    return (
        <div className={`py-5 border-t border-2 border-b border-gray-200 ${isLast ? "mb-auto" : ""} ${isChatGPT && "bg-gray-100"}`}>
            <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
                <img src={message.user.avatar} alt="" className="h-8 w-8"/>
                <p className="pt-1 text-sm">
                    {parsedText}
                </p>
            </div>
        </div>
    );
}

export default Message;
