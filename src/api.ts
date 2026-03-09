const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

export interface UploadResponse {
  document_id: string;
  filename: string;
  status: string;
  chunks_created: number;
}

export interface Citation {
  document: string;
  page: number;
  snippet: string;
}

export interface DocumentInfo {
  document_id: string;
  filename: string;
  file_size: number;
  chunks_created: number;
}

export interface DocumentsResponse {
  documents: DocumentInfo[];
  total: number;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
  confidence: string;
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Upload failed: ${text}`);
  }

  return res.json();
}

export async function fetchDocuments(): Promise<DocumentsResponse> {
  const res = await fetch(`${BASE_URL}/documents/`);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Fetch documents failed: ${text}`);
  }

  return res.json();
}

export interface ToolCall {
  tool_name: string;
  args: Record<string, unknown>;
  result: string;
}

export interface AgentChatResponse {
  response: string;
  tool_calls: ToolCall[];
}

export async function agentChat(message: string): Promise<AgentChatResponse> {
  const res = await fetch(`${BASE_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Agent chat failed: ${text}`);
  }

  return res.json();
}

export async function askQuestion(
  question: string,
  documentId?: string
): Promise<AskResponse> {
  const body: Record<string, unknown> = { question };
  if (documentId) body.document_id = documentId;

  const res = await fetch(`${BASE_URL}/ask/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Ask failed: ${text}`);
  }

  return res.json();
}
