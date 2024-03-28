import Chat from "all/components/Chat";
import ProductSolutionInput from "all/components/ProductSolutionInput";

type Props= {
    params: {
        id: string;
    }
}

function ProductSolutionPage({params: {id}}: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
        <div className="overflow-y-auto h-full">
        <Chat chatId ={id}/>
        </div>
        <ProductSolutionInput chatId ={id}/>
    </div>
  );
}

export default ProductSolutionPage;