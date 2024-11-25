import OpenAI from 'openai';
import toast from 'react-hot-toast';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const assistantId = import.meta.env.VITE_ASSISTANT_ID;

if (!apiKey || apiKey.startsWith('sk-') === false) {
  console.error('Invalid OpenAI API key configuration');
}

if (!assistantId || !assistantId.startsWith('asst_')) {
  console.error('Invalid OpenAI Assistant ID configuration');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export async function createThread() {
  if (!apiKey || !assistantId) {
    toast.error('OpenAI configuration is missing');
    throw new Error('OpenAI configuration is missing');
  }

  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    if (error.code === 'invalid_api_key') {
      toast.error('Please configure a valid OpenAI API key');
    } else {
      toast.error('Failed to initialize chat');
    }
    throw error;
  }
}

export async function sendMessage(threadId, content) {
  if (!apiKey || !assistantId) {
    toast.error('OpenAI configuration is missing');
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
        throw new Error('Assistant response failed');
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
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.code === 'invalid_api_key') {
      toast.error('Please configure a valid OpenAI API key');
    } else {
      toast.error('Failed to send message');
    }
    throw error;
  }
}