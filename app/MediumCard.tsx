import Image from 'next/image';
import Link from 'next/link';


interface MediumCardProps {
	img: string;
	title: string;
	href: string;
}

const MediumCard = ({ img, title, href }: MediumCardProps) => {
	return (
		<Link href={href}>
		  <div className="transition duration-300 ease-out transform cursor-pointer hover:scale-105">
			<div className="relative h-80 w-80 ">
			  <Image src={img} 
			  fill 
			  className="rounded-xl" 
			  alt={title} />
			</div>
			<h3 className="mt-3 text-2xl">{title}</h3>
		  </div>
		</Link>
	  );
	};

export default MediumCard;