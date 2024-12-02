import Image from "next/image";

const Header=()=> {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo and NavLinks */}
        <div className="flex items-center space-x-6">
          <Image
            src="/trello.png" // Replace with the actual path of your logo
            alt="Trello Logo"
            width={32}
            height={32}
          />
          <nav className="flex items-center space-x-4">
            <div className="group relative">
              <button className="hover:text-gray-300">Workspaces</button>
              {/* Dropdown Menu for Workspaces */}
              <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white text-gray-700 shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Workspace 1
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Workspace 2
                </a>
              </div>
            </div>
            <div className="group relative">
              <button className="hover:text-gray-300">Recent</button>
              {/* Dropdown Menu for Recent */}
              <div className="hidden group-hover:block absolute left-0 mt-2 w-48 bg-white text-gray-700 shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Recent 1
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Recent 2
                </a>
              </div>
            </div>
            <div className="group relative">
              <button className="hover:text-gray-300">Starred</button>
            </div>
            <div className="group relative">
              <button className="hover:text-gray-300">Templates</button>
            </div>
            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              Create
            </button>
          </nav>
        </div>

        {/* Right Section: Search and Account */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white px-4 py-1 rounded-lg focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 016.32 12.906l4.384 4.384a1 1 0 01-1.414 1.414l-4.384-4.384A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </button>
          </div>

          {/* Icons and User Account */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a7.003 7.003 0 0013.415 4.906c.911.911.911 2.501 0 3.414l-4.707 4.707c-.39.39-1.024.39-1.414 0l-5.293-5.293a1 1 0 00-1.414 0l-5.293 5.293a1 1 0 01-1.414 0l-4.707-4.707c-.911-.911-.911-2.501 0-3.414A7.003 7.003 0 0011.049 2.927z"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <div className="relative">
              <button className="bg-gray-700 w-8 h-8 rounded-full text-white flex items-center justify-center">
                GA
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header