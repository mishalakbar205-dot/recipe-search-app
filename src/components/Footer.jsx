function Footer() {
    return (
        <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 shadow-lg">
            {/* Gradient divider line */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500"></div>

            <div className="text-center py-6 px-4">
                <p className="text-gray-300 font-medium tracking-wide">
                    &copy; {new Date().getFullYear()}{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-rose-400">
                        recipesearch.com
                    </span>{" "}
                    | All rights reserved
                </p>
            </div>
        </footer>
    );
}

export default Footer;
