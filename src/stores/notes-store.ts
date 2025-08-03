import type { Note } from "@/utils/types/types";
import { atom } from "nanostores";

export const selectedNote = atom<Note | null>(null);

export const setSelectedNote = (note: Note | null) => {
  const solutions = Array.from(new Set(note?.solutions));
  selectedNote.set(note && { ...note, solutions });
};
