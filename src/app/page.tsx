export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Welcome to Our Platform
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage your account and access exclusive features. Sign in to get started or create a new account.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            Login
          </a>
          
          <a 
            href="/register"
            className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            Register
          </a>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>Need help? Contact support</p>
        </div>
      </div>
    </main>
  );
}