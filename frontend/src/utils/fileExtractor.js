import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Worker for PDF.js - use CDN for compatibility
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`
}

export async function extractTextFromFile(file) {
  const name = (file.name || '').toLowerCase()
  const type = file.type || ''

  if (name.endsWith('.txt') || type === 'text/plain') {
    return file.text()
  }

  if (name.endsWith('.pdf') || type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    let text = ''
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item) => item.str).join(' ') + '\n'
    }
    return text.trim()
  }

  if (name.endsWith('.docx') || name.endsWith('.doc') || type.includes('wordprocessingml') || type.includes('msword')) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  // Fallback: try as text
  return file.text()
}
