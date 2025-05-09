import "./globals.css"

export const metadata = {
  title: "Indo-Pak Conflict Updates",
  description: "Stay informed with the latest updates on the Indian-Pakistani conflict",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
