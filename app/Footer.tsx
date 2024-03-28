type FooterProps = {
	className?: string;
  };
  
  const Footer: React.FC<FooterProps> = ({ className }) => {
	return (
		<footer className="grid grid-cols-1 px-16 text-gray-600 bg-gray-100 justify-items-center gap-y-10 py-14 md:grid-cols-4">
			<div className="space-y-4 text-xs text-gray-800">
				<h5 className="font-bold">ABOUT</h5>
				<p>Our Vision</p>
				<p>How PrivacyGPT works</p>
				<p>Founders</p>
			</div>

			<div className="space-y-4 text-xs text-gray-800">
				<h5 className="font-bold">COMMUNITY</h5>
				<p>Terms & Conditions</p>
				<p>Privacy Policy</p>
				<p>Blog</p>
			</div>

			<div className="space-y-4 text-xs text-gray-800">
				<h5 className="font-bold">HOST</h5>
				<p>Ask Privacy GPT</p>
				<p>xxxxx</p>
				<p>xxxx</p>
			</div>
		</footer>
	);
};

export default Footer;