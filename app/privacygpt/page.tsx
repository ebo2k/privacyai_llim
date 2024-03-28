import '../../styles/globals.css';
import { SunIcon } from '@heroicons/react/24/outline'
import { BoltIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

 function Privacygpt() {
    
  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen px-2 text-white" >
            <Link
                href ="/privacygpt"
                className="text-5xl font-bold mb-20">
                ChatGPT
            </Link>
        <div className='flex space-x-2 text-center'>
            <div>
                <div className="flex flex-col items-center justify-center mb-5">
                    {/*Sun Icon */}
                    <SunIcon className="h-8 w-8" />
                    <h2>Examples</h2>
                </div>
                <div className="space-y-2">
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                </div>
            </div>
            <div>
                <div className="flex flex-col items-center justify-center mb-5">
                    {/*Bolt Icon */}
                    <BoltIcon className="h-8 w-8" />
                    <h2>Capabilies</h2>
                </div>
                <div className="space-y-2">
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                </div>
            </div>
            <div>
                <div className="flex flex-col items-center justify-center mb-5">
                    {/*ExclamationTriangle Icon */}
                    <ExclamationTriangleIcon className="h-8 w-8" />
                    <h2>Limitations1</h2>
                </div>
                <div className="space-y-2">
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                    <p className="infoText">"Explain"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Privacygpt;

