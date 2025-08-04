import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date | string): string {
  // 确保 date 是 Date 对象
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '未知时间';
  }
  
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return dateObj.toLocaleDateString('zh-CN');
  }
}

export function formatTime(date: Date | string): string {
  // 确保 date 是 Date 对象
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '--:--';
  }
  
  return dateObj.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function searchInText(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function highlightText(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function calculateRelevance(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  let score = 0;
  words.forEach(word => {
    if (textLower.includes(word)) {
      score += 1;
    }
  });
  
  return score / words.length;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }
  
  return blocks;
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

export function getContrastColor(hexColor: string): string {
  // 移除#号
  const hex = hexColor.replace('#', '');
  
  // 转换为RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#ffffff';
}

export function generateGradient(colors: string[]): string {
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const attempt = async () => {
      try {
        attempts++;
        const result = await fn();
        resolve(result);
      } catch (error) {
        if (attempts >= maxAttempts) {
          reject(error);
        } else {
          setTimeout(attempt, delay);
        }
      }
    };
    
    attempt();
  });
}

// 将 localStorage 中的字符串日期转换为 Date 对象
export function parseDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    // 检查是否是日期字符串
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (dateRegex.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => parseDates(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = parseDates(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
} 