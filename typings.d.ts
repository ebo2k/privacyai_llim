interface Message {
text: string ;
createdAt: admin.firestore.Timestamp;
user: {
    _id: string;
    name: string;
    avatar:string;
    };
}

interface Message2 {
    text: string[];
    createdAt: admin.firestore.Timestamp;
    user: {
        _id: string;
        name: string;
        avatar:string;
        };
    }

interface Products {
        userId: number;
        id: number;
        title: string;
        completed: boolean;
};