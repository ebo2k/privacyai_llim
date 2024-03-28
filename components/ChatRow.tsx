import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { db } from "all/firebase";
import { collection, deleteDoc, doc, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

type Props = {
    id: string;
    filterRiskAssessment?: boolean;
    filterAdvice?: boolean;
    filterPrivacyRequirement?: boolean;
    filterProductSolution?: boolean;

}

function ChatRow({ id, filterRiskAssessment = false, filterAdvice = false, filterPrivacyRequirement = false, filterProductSolution = false }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const {data: session} = useSession();
    const [active, setActive] = useState(false);

    let queryParam;
    if (filterRiskAssessment) {
        queryParam = where('isRiskAssessment', '==', true);
    } else if (filterAdvice) {
        queryParam = where('isAdvice', '==', true);
    } else if (filterPrivacyRequirement) {
        queryParam = where('isPrivacyRequirement', '==', true);
    } else if (filterProductSolution) {
        queryParam = where('isProductSolution', '==', true);
    }else 
    {
        queryParam = orderBy('createdAt', 'desc');
    }

    const [messages] = useCollection(
        query(
            collection(db, 'users', session?.user?.email!, 'chats', id, 'messages'),
            queryParam
        )
    );

    useEffect(() => {
        if (!pathname) return;
        setActive (pathname.includes(id));

    }, [pathname]);

    const removeChat = async(event: React.MouseEvent) => {
        event.stopPropagation();
        await deleteDoc(doc(db,'users',session?.user?.email!,'chats', id));
    }

    const chatText = messages?.docs[messages?.docs.length - 1]?.data().text || 'New Chat';
    const truncatedChatText = chatText.length > 25 ? chatText.substring(0, 25) + '...' : chatText;
    let chatBasePath = "/protected/client/chat";
    if (pathname) {
        chatBasePath = pathname.includes("/privacyrequirement") ? "/protected/client/privacyrequirementchat" :
                        pathname.includes("/riskassessment") ? "/protected/client/riskassessmentchat" :
                        pathname.includes("/productsolution") ? "/protected/client/productsolutionchat" :
                        "/protected/client/chat";
    }

    return (
        <div className={`chatRow justify-center ${active && "bg-gray-700/50"} flex items-center`}>
            <Link href={`${chatBasePath}/${id}`} className="flex-grow">
                <div className="flex items-center">
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2"/>
                    <p className="flex-1 hidden md:inline-flex truncate">
                        {truncatedChatText}
                    </p>
                </div>
            </Link>
            <TrashIcon
                onClick={(event) => removeChat(event)}
                className="h-5 w-5 text-gray-700 hover:text-red-700"/>
        </div>
    )
}

export default ChatRow;

function asyn() {
    throw new Error("Function not implemented.");
}
