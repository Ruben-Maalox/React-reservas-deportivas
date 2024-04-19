export default function Footer() {
  return (
    <footer className="p-5 bg-gray-200 text-white">
      <div className="flex items-center justify-between">
        <img src="./src/assets/images/logo-white-transp.png" alt="LetsMove" width={100} height={100} className="w-auto h-auto" />
        <div className="social-networks flex flex-row">
          <img src="./src/assets/icons/facebook.svg" alt="Facebook" width={40} height={40} />
          <img src="./src/assets/icons/instagram.svg" alt="Instagram" width={40} height={40} />
          <img src="./src/assets/icons/twitter.svg" alt="twitter" width={40} height={40} />
          <img src="./src/assets/icons/tiktok.svg" alt="tiktok" width={40} height={40} />
        </div>
      </div>
    </footer>
  );
}