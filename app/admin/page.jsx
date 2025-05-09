"use client"

import { useState } from "react"
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    source: "",
    status: "verified",
    image: null,
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      setSuccessMessage("Post created successfully!")
      setIsSubmitting(false)

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: "",
          summary: "",
          content: "",
          source: "",
          status: "verified",
          image: null,
        })
        setPreviewUrl(null)
        setSuccessMessage("")
      }, 2000)
    }, 1500)
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setPreviewUrl(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/" className="p-2">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-serif font-bold">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <section className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

          {successMessage && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
              <div className="flex flex-wrap gap-4">
                {["verified", "unverified", "false"].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#c17a7a] focus:ring-[#c17a7a]"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                  </label>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="Brief summary of the post"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Keep it short and concise (max 150 characters)</p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Full Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="Full content of the post"
                required
              ></textarea>
            </div>

            {/* Source */}
            <div className="mb-6">
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c17a7a]"
                placeholder="e.g., ANI, Reuters"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-[#c17a7a] text-white rounded-lg font-medium flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#a56767]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Creating Post...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Post
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
