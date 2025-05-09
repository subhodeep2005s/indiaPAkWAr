 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Redirect to admin page on success
      router.push("/admin")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access the admin panel</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-[#c17a7a] text-white rounded-lg font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#a56767]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-[#c17a7a] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}