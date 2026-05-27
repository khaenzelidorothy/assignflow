import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AssignFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Intelligent Workforce
            <span className="text-primary-600"> Scheduling</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Automate your workforce allocation with fairness, intelligence, and ease.
            Perfect for churches, NGOs, hospitals, and volunteer organizations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/get-started" className="btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fair Distribution</h3>
            <p className="text-gray-600">
              Automatic fairness scoring ensures everyone gets equal opportunities
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">
              AI-powered matching considers skills, availability, and preferences
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-600">
              Track fairness metrics, burnout risks, and scheduling efficiency
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
