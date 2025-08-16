'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Globe, Smartphone } from 'lucide-react'
import { useAuth } from '~/components/providers'

export default function HomePage() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand/15">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to sync your business across all platforms?
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand/15">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-brand" />
              <span className="text-2xl font-bold text-gray-900">
                BusinessSync
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sync Your Business
            <span className="text-brand block">Across All Platforms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Keep your business information consistent on Google Business
            Profile, Bing, Apple Maps, Facebook, Yelp, and more. Update once,
            sync everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors text-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Online Presence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to keep your business information
              up-to-date across all major platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-Platform Sync
              </h3>
              <p className="text-gray-600">
                Connect and sync with Google Business Profile, Bing Places,
                Apple Maps, Facebook, Yelp, and more
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Changes are pushed to all connected platforms instantly,
                ensuring consistency
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mobile Optimized
              </h3>
              <p className="text-gray-600">
                Manage your business listings on the go with our mobile-friendly
                dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supported Platforms
            </h2>
            <p className="text-xl text-gray-600">
              Connect your business to all the platforms that matter
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'Google Business Profile',
              'Bing Places',
              'Apple Maps',
              'Facebook',
              'Yelp',
              'TripAdvisor',
              'Foursquare',
              'More Coming Soon',
            ].map((platform) => (
              <div
                key={platform}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3"></div>
                <h3 className="font-medium text-gray-900">{platform}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of businesses that trust BusinessSync to manage their
            online presence
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold">BusinessSync</span>
            </div>
            <div className="text-gray-400">
              © 2025 BusinessSync. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
