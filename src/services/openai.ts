import OpenAI from 'openai';
import toast from 'react-hot-toast';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const assistantId = import.meta.env.VITE_ASSISTANT_ID;

if (!apiKey) {
  console.error('OpenAI API key is not configured');
}

if (!assistantId) {
  console.error('OpenAI Assistant ID is not configured');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export async function createThread() {
  if (!apiKey || !assistantId) {
    throw new Error('OpenAI configuration is missing');
  }

  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error: any) {
    console.error('Error creating thread:', error);
    if (error.code === 'invalid_api_key') {
      toast.error('Invalid OpenAI API key');
    } else {
      toast.error('Failed to create chat thread');
    }
    throw error;
  }
}

export async function sendMessage(threadId: string, content: string) {
  if (!apiKey || !assistantId) {
    throw new Error('OpenAI configuration is missing');
  }

  try {
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    
    if (lastMessage.content[0].type === 'text') {
      return lastMessage.content[0].text.value;
    }
    
    return '';
  } catch (error: any) {
    console.error('Error sending message:', error);
    if (error.code === 'invalid_api_key') {
      toast.error('Invalid OpenAI API key');
    } else {
      toast.error('Failed to send message');
    }
    throw error;
  }
}