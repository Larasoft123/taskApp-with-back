import type { Note } from "@/utils/types/types"
import { Eye } from "lucide-preact"
import { openSidenav } from "@/stores/sidenav-store.ts";
import { setSelectedNote } from "@/stores/notes-store.ts";
import { useRef, useState } from "preact/hooks";

export const NoteBtn = ({ note }: { note: Note }) => {
    const btn = useRef<HTMLButtonElement>(null);
    const [solutions,setSolutions] = useState(note.solutions.length);

    const handleClick = async () => {
        const note = JSON.parse(btn.current?.dataset.note as string)
        setSelectedNote(note);
        openSidenav();


        document.addEventListener("solution-created", (e: any) => {
            const { solution } = e.detail;

            if (solution.noteId !== note.id) return;

            note.solutions.push(solution);
            setSolutions(note.solutions.length)
            btn.current ? btn.current.dataset.note = JSON.stringify(note) : null;
        });

        document.addEventListener("solution-deleted", (e: any) => {
            const { solutions } = e.detail;
            if (solutions.length < 1 || solutions[0].noteId !== note.id) return;
            const replacement = solutions[0].id ? solutions : [];
            setSolutions(replacement.length)

            note.solutions = replacement;
            btn.current ? btn.current.dataset.note = JSON.stringify(note) : null;
        });
    }



    return (

        <button
            ref={btn}
            onClick={handleClick}
            data-note={JSON.stringify({
                id: note.id,
                title: note.title,
                description: note.description,
                solutions: note.solutions,
            })}

            class={`w-full open-sidenav-btn cursor-pointer flex items-center justify-center space-x-2 p-3 rounded-lg transition-all duration-300 hover:scale-[1.02]  dark:from-blue-600/15 dark:to-purple-600/15 dark:hover:from-blue-600/25 dark:hover:to-purple-600/25 dark:text-blue-300 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700`}
        >
            <Eye class="w-4 h-4" />
            <span class="text-sm font-medium">Ver soluciones</span>
            <span
             
                class={`text-xs px-1.5 py-0.5 rounded-full dark:bg-purple-500 0 dark:text-purple-300 bg-purple-100 text-purple-700`}
            >
                {solutions}
            </span>
        </button>
    )
}

