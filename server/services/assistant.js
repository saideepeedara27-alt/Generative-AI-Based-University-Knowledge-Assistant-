import OpenAI from 'openai';

const systemPrompt = `You are CampusMind, a friendly and accurate university knowledge assistant. Help students with courses, study planning, policies, academic support, campus resources, and campus life. Be concise, avoid inventing university-specific facts, and recommend official university sources when exact policies matter.`;

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function demoReply(message) {
  const normalized = message.toLowerCase();
  if (normalized.includes('schedule') || normalized.includes('semester')) {
    return 'I can help you shape a balanced semester. Start with your required modules, then add electives around your preferred learning pace. Share your programme, credit limit, and any fixed commitments to build a draft plan.';
  }
  if (normalized.includes('support') || normalized.includes('academic')) {
    return 'Your academic support hub can connect you with tutoring, writing guidance, study skills workshops, and accessibility services. Tell me your topic or the kind of support you need and I’ll help narrow down the next step.';
  }
  if (normalized.includes('event') || normalized.includes('campus')) {
    return 'Campus life is a great place to start building your community. Look for orientation events, student societies, guest lectures, and volunteer opportunities through your university’s events calendar.';
  }
  return `I’m ready to help with “${message}”. I can organize university information, explain a topic, or point you toward the right campus resource. What detail would be most useful to start with?`;
}

export async function createAssistantReply(message, mode) {
  if (!client) return { reply: demoReply(message), source: 'demo' };

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Response style: ${mode}.\n\n${message}` }
    ]
  });

  return { reply: response.output_text || demoReply(message), source: 'openai' };
}
