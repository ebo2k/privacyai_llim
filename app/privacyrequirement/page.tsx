import '../../styles/globals.css';
import { SunIcon } from '@heroicons/react/24/outline'
import { BoltIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

 function PrivacyRequirement() {

  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen px-2 text-white" >
            <Link
                href ="/riskassessment"
                className="text-5xl font-bold mb-20">
                Privacy Requirement
            </Link>
        <div className='flex space-x-2 text-center'>
            <div>
                <div className="flex flex-col items-center justify-center mb-5">
                    {/*Sun Icon */}
                    <SunIcon className="h-8 w-8" />
                    <h2>Analyze and develop privacy requirements</h2>
                </div>
            </div>

            </div>
        </div>
    </div>
  )
}

export default PrivacyRequirement;

