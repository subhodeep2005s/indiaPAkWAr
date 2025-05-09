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

// Sample news data
const newsData = [
  {
    id: 1,
    status: "verified",
    title: "Indian Army Intercepts Drone",
    image: "https://images.indianexpress.com/2025/05/MEA-briefing.jpg",
    summary:
      "A drone was shot down near the LoC in the Poonch sector today. Military officials confirmed the drone was carrying surveillance equipment.",
    content:
      "A drone was shot down near the Line of Control (LoC) in the Poonch sector today. Military officials confirmed the drone was carrying surveillance equipment and was intercepted by the Indian Army using anti-drone technology. This marks the fifth such incident in the region this month, highlighting the increasing use of unmanned aerial vehicles for reconnaissance purposes along the border. The debris has been collected for further forensic analysis to determine its origin and capabilities.",
    source: "ANI",
    date: "Today",
    timestamp: "7 April 10:45 AM IST",
    url: "https://example.com/news/1",
  },
  {
    id: 2,
    status: "unverified",
    title: "Peace Talks Scheduled for Next Week",
    image: "https://images.indianexpress.com/2025/05/andhra-1.jpg",
    summary:
      "Officials from both countries are reportedly meeting next week to discuss de-escalation measures along the border regions.",
    content:
      "Officials from both countries are reportedly meeting next week to discuss de-escalation measures along the border regions. The talks, which have not been officially confirmed by either government, are expected to focus on reducing military presence in key flashpoint areas and establishing better communication channels to prevent misunderstandings. Sources close to the diplomatic channels suggest that international mediators may also be present during these discussions. If confirmed, this would mark the first high-level dialogue between the two nations in over eight months.",
    source: "Reuters",
    date: "Today",
    timestamp: "7 April 09:30 AM IST",
    url: "https://example.com/news/2",
  },
  {
    id: 3,
    status: "false",
    title: "Major Troop Movements Reported",
    image: "https://images.indianexpress.com/2025/05/Security-personnel-inspect-metal-debris-found-in-an-open-field-at-Makhan-Windi-village-in-Amritsar-Thursday.-PTI1.jpg",
    summary:
      "Reports of significant troop deployments along the eastern border have been confirmed as routine exercises.",
    content:
      "Reports of significant troop deployments along the eastern border have been confirmed as routine exercises. Earlier social media claims suggesting a major military buildup have been debunked by official sources from both countries. The exercises were pre-planned and notification had been provided through established military communication channels. Defense analysts note that such exercises are conducted periodically and should not be misinterpreted as escalation. Citizens in border areas have been advised to disregard rumors and rely only on official information.",
    source: "AFP",
    date: "Yesterday",
    timestamp: "6 April 14:20 PM IST",
    url: "https://example.com/news/3",
  },
  {
    id: 4,
    status: "verified",
    title: "Water Sharing Agreement Under Review",
    image: "https://images.indianexpress.com/2025/04/Supreme-Court-6.jpg",
    summary:
      "The joint commission on water resources is reviewing the current sharing agreement amid concerns over reduced flow in shared rivers.",
    content:
      "The joint commission on water resources is reviewing the current sharing agreement amid concerns over reduced flow in shared rivers. The commission, which meets bi-annually, is examining data from monitoring stations along major waterways to assess compliance with existing treaties. Environmental experts have raised concerns about the impact of climate change on glacial melt patterns, which could further complicate water sharing arrangements in the coming years. Both nations rely heavily on these shared water resources for agriculture, which remains a crucial economic sector in the region.",
    source: "The Hindu",
    date: "Yesterday",
    timestamp: "6 April 08:15 AM IST",
    url: "https://example.com/news/4",
  },
  {
    id: 5,
    status: "verified",
    title: "Trade Routes Reopened After Temporary Closure",
    image: "https://images.indianexpress.com/2025/05/The-Subcontinents-challenge_Premium-01-1.jpg",
    summary:
      "Key trade routes between the two countries have resumed operations following a three-day closure due to security concerns.",
    content:
      "Key trade routes between the two countries have resumed operations following a three-day closure due to security concerns. The routes, vital for the exchange of agricultural products and textiles, were temporarily shut down after a security alert. Merchants on both sides expressed relief as the resumption of trade will prevent significant economic losses. Authorities have implemented enhanced security measures, including increased personnel and scanning equipment at crossing points. The brief disruption highlighted the economic interdependence that persists despite political tensions.",
    source: "Economic Times",
    date: "All Time",
    timestamp: "2 April 11:30 AM IST",
    url: "https://example.com/news/5",
  },
]

export default function Home() {
  const [filter, setFilter] = useState("Today")
  const [selectedNews, setSelectedNews] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const now = useCurrentDateTime()

  const filteredNews = newsData.filter((news) => filter === "All Time" || news.date === filter)

  const openModal = (news) => {
    setSelectedNews(news)
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

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Enhanced Header */}
      <header
  style={{
    backgroundImage:
      "url('/bannnerImage.png')",
  }}
  className="sticky top-0 z-20 bg-cover bg-center border-b border-gray-200 shadow-md text-white"
>
  <div className="w-full h-full ">
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide flex items-center gap-2">
        🇮🇳 REAL WAR UPDATES <span className="text-blue-300">📰</span>
      </h1>
      <p className="text-sm md:text-base mt-2 text-white/90">
        Trusted News. No Noise. Verified. Patriotic.
      </p>
      <div className="text-xs text-white/70 mt-1">
        {new Date().toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        •{" "}
        {new Date().toLocaleTimeString(undefined, {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-[1.02]"
              onClick={() => openModal(news)}
            >
              <div className="p-4">
                <div
                  className={`inline-block px-2 py-1 rounded text-white text-xs font-bold mb-2 ${getStatusColor(news.status)}`}
                >
                  {news.status === "verified" && "🟢 "}
                  {news.status === "unverified" && "🟡 "}
                  {news.status === "false" && "🔴 "}
                  {getStatusText(news.status)}
                </div>
                <h2 className="text-xl font-bold mb-2">{news.title}</h2>
                <div className="h-48 bg-gray-200 mb-3 rounded overflow-hidden">
                  <img src={news.image || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-700 text-sm mb-3">{news.summary}</p>
                <div className="text-xs text-gray-500">
                  Source: {news.source} • {news.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
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
                  src={selectedNews.image || "/placeholder.svg"}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-gray-700 mb-6">{selectedNews.content}</p>
              <div className="text-sm text-gray-500 mb-4">
                Source: {selectedNews.source} • {selectedNews.timestamp}
              </div>
              <a
                href={selectedNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Original Source <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
