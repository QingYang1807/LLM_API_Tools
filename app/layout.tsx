import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM API Tools - 智能对话助手',
  description: '支持多厂商大模型API的智能对话工具，支持智谱AI等模型',
  keywords: 'AI, 大模型, 智谱AI, 对话, API工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  )
} 