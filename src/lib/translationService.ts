// Translation service using MyMemory API (free, no API key required)
// Limit: 5000 characters per request, 1000 requests per day per IP

interface TranslationResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseDetails: string;
  responseStatus: number;
  matches?: any[];
}

// Detect if the text is primarily Chinese or English
export function detectLanguage(text: string): 'zh' | 'en' | 'mixed' {
  // Remove spaces and punctuation for analysis
  const cleanText = text.replace(/[\s\.,!?;:'"]/g, '');
  
  // Count Chinese characters
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // Count English letters
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  
  // Determine primary language
  if (chineseChars === 0 && englishChars > 0) {
    return 'en';
  } else if (englishChars === 0 && chineseChars > 0) {
    return 'zh';
  } else if (chineseChars > englishChars) {
    return 'zh';
  } else {
    return 'en';
  }
}

// Split text into chunks to respect API limits
function splitTextIntoChunks(text: string, maxLength: number = 4500): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/([。！？\.\!\?]\s*)/);
  
  let currentChunk = '';
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (currentChunk.length + sentence.length < maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Translate text using MyMemory API
export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  try {
    // If text is too long, split it into chunks
    const chunks = splitTextIntoChunks(text);
    const translatedChunks: string[] = [];
    
    for (const chunk of chunks) {
      // Encode text for URL
      const encodedText = encodeURIComponent(chunk);
      
      // Build API URL
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${fromLang}|${toLang}`;
      
      // Make API request
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }
      
      const data: TranslationResponse = await response.json();
      
      if (data.responseStatus !== 200) {
        throw new Error(`Translation failed: ${data.responseDetails}`);
      }
      
      translatedChunks.push(data.responseData.translatedText);
      
      // Add a small delay between requests to avoid rate limiting
      if (chunks.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// Main translation function with language detection
export async function autoTranslate(text: string): Promise<{
  originalLang: 'zh' | 'en' | 'mixed';
  chinese: string;
  english: string;
}> {
  const detectedLang = detectLanguage(text);
  
  let chinese = '';
  let english = '';
  
  try {
    if (detectedLang === 'zh') {
      // Original is Chinese, translate to English
      chinese = text;
      english = await translateText(text, 'zh-CN', 'en-US');
    } else if (detectedLang === 'en') {
      // Original is English, translate to Chinese
      english = text;
      chinese = await translateText(text, 'en-US', 'zh-CN');
    } else {
      // Mixed content, keep original and try to translate to the opposite
      // Detect which language is more dominant and translate accordingly
      chinese = text;
      english = await translateText(text, 'zh-CN', 'en-US');
    }
  } catch (error) {
    // If translation fails, at least keep the original text
    if (detectedLang === 'zh' || detectedLang === 'mixed') {
      chinese = text;
      english = `[Translation failed] ${text}`;
    } else {
      english = text;
      chinese = `[翻译失败] ${text}`;
    }
  }
  
  return {
    originalLang: detectedLang,
    chinese,
    english
  };
}

// Alternative: Use browser's built-in translation if available (experimental)
export async function browserTranslate(text: string, targetLang: string): Promise<string> {
  // Check if browser supports translation API (Chrome only for now)
  if ('translation' in self && 'createTranslator' in (self as any).translation) {
    try {
      const translator = await (self as any).translation.createTranslator({
        sourceLanguage: 'auto',
        targetLanguage: targetLang,
      });
      
      const result = await translator.translate(text);
      return result;
    } catch (error) {
      console.error('Browser translation failed:', error);
      throw error;
    }
  } else {
    throw new Error('Browser translation API not supported');
  }
}

// Fallback simple translation for common phrases (for demonstration)
const commonPhrases: Record<string, Record<string, string>> = {
  en: {
    '今天': 'Today',
    '很好': 'Very good',
    '感恩': 'Grateful',
    '学习': 'Learning',
    '进步': 'Progress',
    '挑战': 'Challenge',
    '完成': 'Completed',
    '计划': 'Plan',
    '反思': 'Reflection',
    '目标': 'Goal',
  },
  zh: {
    'Today': '今天',
    'Very good': '很好',
    'Grateful': '感恩',
    'Learning': '学习',
    'Progress': '进步',
    'Challenge': '挑战',
    'Completed': '完成',
    'Plan': '计划',
    'Reflection': '反思',
    'Goal': '目标',
  }
};

// Simple phrase replacement for basic translation (fallback)
export function simpleTranslate(text: string, toLang: 'zh' | 'en'): string {
  let translated = text;
  const phrases = toLang === 'zh' ? commonPhrases.zh : commonPhrases.en;
  
  Object.entries(phrases).forEach(([original, translation]) => {
    const regex = new RegExp(original, 'gi');
    translated = translated.replace(regex, translation);
  });
  
  return translated;
}