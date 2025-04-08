import { ref } from 'vue'

const STORAGE_AI_CONFIG = 'ctidog:ai-config'

export function useAIChat() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const generateSummary = async (intelList: any[]): Promise<string> => {
    loading.value = true
    error.value = null

    try {
      const config = JSON.parse(localStorage.getItem(STORAGE_AI_CONFIG) || '{}')
      const apiKey = config.deepseek?.api_key

      if (!apiKey) {
        throw new Error('未配置 Deepseek API Key')
      }

      const messages = [
        {
          role: 'system',
          content: '你是一个网络安全分析专家，请根据以下多个情报源返回的内容，进行综合分析并给出结论。'
        },
        {
          role: 'user',
          content: buildPromptFromIntelList(intelList)
        }
      ]

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat', // 如果有可选模型，这里可以扩展
          messages,
          temperature: 0.7
        })
      })

      const result = await response.json()

      const summary = result.choices?.[0]?.message?.content?.trim()

      if (!summary) throw new Error('LLM 返回内容为空')

      return summary
    } catch (err: any) {
      error.value = err.message || '生成失败'
      return '综合分析失败。'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    generateSummary
  }
}

// 构造 Prompt 输入内容
function buildPromptFromIntelList(intelList: any[]): string {
  return intelList.map(item => {
    return `情报源：${item.source}\n摘要：${item.summary}\n完整信息：${item.full}\n\n`
  }).join('\n\n')
}
