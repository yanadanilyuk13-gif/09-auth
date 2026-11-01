import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  search: string,
  tag?: string
): Promise<NotesResponse> {
  const cookieStore = await cookies();

  const response = await nextServer.get<NotesResponse>('/notes', {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params: {
      page,
      search,
      perPage: 12,
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${encodeURIComponent(id)}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

interface SessionResponse {
  success: boolean;
}

export async function checkSession(cookieHeader?: string) {
  const cookieStore = cookieHeader === undefined ? await cookies() : null;

  const response = await nextServer.get<SessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieHeader ?? cookieStore?.toString() ?? '',
    },
  });

  return response;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();

  const response = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}
