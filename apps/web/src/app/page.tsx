'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Search, Zap } from 'lucide-react'
import { useAuth } from '~/components/providers'
import { Header } from '~/components/Header'
import Logo from '~/components/Logo'
import { APP_NAME } from '~/lib/constants'

export default function HomePage() {
  const { user } = useAuth()

  if (user) {
    return (
      <>
        <Header />
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
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand/15">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Logo className="h-8 text-brand" />
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
            Find Your Business
            <span className="text-brand block">Across All Platforms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Search and discover how your business appears across Google, Bing,
            Apple Maps, Facebook, Yelp, and more. Get a complete view of your
            online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors text-lg"
            >
              Search Your Business
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get complete visibility into your business presence across all
              major platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Search & Discover
              </h3>
              <p className="text-gray-600">
                Find how your business appears across all major platforms with
                our comprehensive search engine
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track & Monitor
              </h3>
              <p className="text-gray-600">
                Keep track of all your business listings and monitor how your
                information appears across platforms
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Insights
              </h3>
              <p className="text-gray-600">
                Understand your online presence and identify opportunities to
                improve your business visibility
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
              Search and monitor your business across all the platforms that
              matter
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
            Join thousands of businesses using {APP_NAME} to monitor their
            online presence
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Start Searching
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="h-6 text-white" mono />
            <div className="text-gray-400">
              © 2025 {APP_NAME}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
