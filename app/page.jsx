"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink } from "lucide-react"

function useCurrentDateTime() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return now
}

export default function Home() {
  const [filter, setFilter] = useState("Today")
  const [selectedNews, setSelectedNews] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const now = useCurrentDateTime()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts')
      }

      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (filter === "Today") {
      return postDate.toDateString() === today.toDateString()
    } else if (filter === "Yesterday") {
      return postDate.toDateString() === yesterday.toDateString()
    }
    return true // "All Time"
  })

  const openModal = (post) => {
    setSelectedNews(post)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-500"
      case "unverified":
        return "bg-yellow-500"
      case "false":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "VERIFIED"
      case "unverified":
        return "UNVERIFIED"
      case "false":
        return "FALSE"
      default:
        return "UNKNOWN"
    }
  }

  const formatDate = (date) => {
    const postDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (postDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (postDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    return postDate.toLocaleDateString()
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Enhanced Header */}
      <header
        style={{
          backgroundImage: "url('/bannnerImage.png')",
        }}
        className="sticky top-0 z-20 bg-cover bg-center border-b border-gray-200 shadow-md text-white"
      >
        <div className="w-full h-full">
          <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide flex items-center gap-2">
              🇮🇳 REAL WAR UPDATES <span className="text-blue-300">📰</span>
            </h1>
            <p className="text-sm md:text-base mt-2 text-white/90">
              Trusted News. No Noise. Verified. Patriotic.
            </p>
            <div className="text-xs text-white/70 mt-1">
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              •{" "}
              {now.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Filter Bar */}
            <div className="flex justify-center mt-5 space-x-2 w-full max-w-md">
              {["Today", "Yesterday", "All Time"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border shadow-sm w-full
                    ${filter === option ? "bg-blue-600 text-white" : "bg-white/80 text-gray-900 hover:bg-gray-200"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* News Cards */}
      <section className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-[1.02]"
                onClick={() => openModal(post)}
              >
                <div className="p-4">
                  <div
                    className={`inline-block px-2 py-1 rounded text-white text-xs font-bold mb-2 ${getStatusColor(post.status)}`}
                  >
                    {post.status === "verified" && "🟢 "}
                    {post.status === "unverified" && "🟡 "}
                    {post.status === "false" && "🔴 "}
                    {getStatusText(post.status)}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <div className="h-48 bg-gray-200 mb-3 rounded overflow-hidden">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{post.summary}</p>
                  <div className="text-xs text-gray-500">
                    Source: {post.source} • {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No updates available for this filter.</p>
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
          <div
            className="bg-white w-full max-w-3xl rounded-t-xl sm:rounded-xl max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <div className={`px-2 py-1 rounded text-white text-xs font-bold ${getStatusColor(selectedNews.status)}`}>
                {selectedNews.status === "verified" && "🟢 "}
                {selectedNews.status === "unverified" && "🟡 "}
                {selectedNews.status === "false" && "🔴 "}
                {getStatusText(selectedNews.status)}
              </div>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-200">
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">{selectedNews.title}</h2>
              <div className="h-64 bg-gray-200 mb-4 rounded overflow-hidden">
                <img
                  src={selectedNews.imageUrl || "/placeholder.svg"}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-700 mb-6">{selectedNews.content}</p>
              <div className="text-sm text-gray-500 mb-4">
                Source: {selectedNews.source} • {formatDate(selectedNews.createdAt)}
              </div>
              {(selectedNews.sourceLink || selectedNews.source) && (
                <a
                  href={selectedNews.sourceLink || selectedNews.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Original Source <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
