import type { Note } from "@/utils/types/types";
import { atom } from "nanostores";

export const selectedNote = atom<Note | null>(null);

export const setSelectedNote = (note: Note | null) => {
  selectedNote.set(note);
};

