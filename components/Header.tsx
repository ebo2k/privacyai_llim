import Link from 'next/link'
import SignInButton from './SignInButton';
import Image from 'next/image';
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 p-5 bg-white shadow-md md:px-10">
			{/* Left */}
			<div className="relative flex items-center h-10 my-auto cursor-pointer">
			<nav className="flex items-center justify-center">
          <Link href="/" className="mr-4 relative group">
            Home
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">&nbsp;
          </span>
          </Link>
          <Link href="/products" className="mr-4 relative group">
            Product Analysis
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
          <Link href="/riskassessment" className="mr-4 relative group">
            Risk Assessment
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
          <Link href="/privacyrequirement" className="mr-4 relative group">
            Privacy Requirements
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
          <Link href="/productsolution" className="mr-4 relative group">
            Solution Design
            <span className=" h-[1px] inline-block  bg-dark  absolute left-0 -bottom-0.5
                  group-hover:w-full transition-[width] ease duration-300 dark:bg-light">
              &nbsp;
          </span>
          </Link>
        </nav>
			</div>

			{/* Mid - Links */}
			
			

      <div className="flex justify-center">
       		<div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>
		
			</div>

			{/* Right */}
			<div className="flex  justify-end space-x-4">			
				<SignInButton />
			</div>	
		</header>
  )
}

export default Header