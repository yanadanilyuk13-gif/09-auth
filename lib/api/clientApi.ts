import { nextServer } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

type CreateNoteData = Pick<Note, 'title' | 'content' | 'tag'>;

// GET notes
export async function fetchNotes(
  page: number,
  search: string,
  tag?: string
): Promise<NotesResponse> {
  const response = await nextServer.get<NotesResponse>('/notes', {
    params: {
      page,
      search,
      perPage: 12,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });

  return response.data;
}

// CREATE note
export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', note);

  return response.data;
}

// DELETE note
export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${encodeURIComponent(id)}`);

  return response.data;
}

// GET note by ID
export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${encodeURIComponent(id)}`);

  return response.data;
}

interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post<User>('/auth/register', data);

  return response.data;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<User> {
  const response = await nextServer.post<User>('/auth/login', data);

  return response.data;
}

interface SessionResponse {
  success: boolean;
}

export async function checkSession(): Promise<SessionResponse> {
  const response = await nextServer.get<SessionResponse>('/auth/session');

  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await nextServer.get<User>('/users/me');

  return response.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export async function updateMe(data: { username: string }): Promise<User> {
  const response = await nextServer.patch<User>('/users/me', data);

  return response.data;
}
