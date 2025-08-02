import { Save, X } from "lucide-preact";
import { useForm } from "react-hook-form"
import { useState } from "preact/hooks";
import { useStore } from '@nanostores/preact';
import { closeSidenav } from "@/stores/sidenav-store";
import { selectedNote, setSelectedNote } from "@/stores/notes-store";
import type { Note } from "@/utils/types/types";
import { navigate } from "astro:transitions/client";


type SolutionFormData = {
    title: string;
    content: string;
}

export const SolutionsForm = () => {
    const { register, reset, handleSubmit, formState: { errors } } = useForm<SolutionFormData>();
    const [isOpen, setIsOpen] = useState(false);
    const $selectedNote = useStore(selectedNote) as Note



    const onSubmit = async (data: SolutionFormData) => {
        const { title, content } = data;

        const id = $selectedNote?.id;
        console.log($selectedNote.solutions);

        const res = await fetch("/api/solutions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                title,
                content
            })
        });


        if (!res.ok) {
            alert("Error al guardar la solución");
            return;
        }

        const resData = await res.json();

        closeSidenav()
        closeForm()
        setSelectedNote({ ...$selectedNote, solutions: [...$selectedNote.solutions, resData] })
        navigate(window.location.href)

    }

    const closeForm = () => {
        setIsOpen(false)
        reset()
    }

    return (

        <>


            <button
                onClick={() => setIsOpen(true)}
                disabled={isOpen}
                aria-expanded={isOpen}
                aria-controls="solution-form-container"
                className={`w-full disabled:pointer-events-none flex cursor-pointer items-center justify-center space-x-2 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group  `
                }
            >

                <StrokeIcon />
                <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors duration-300">
                    Añadir nueva solución
                </span>
            </button>


            <div className={`bg-white/80  dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50  p-6 space-y-4 relative  animate-duration-200
                ${isOpen ? "animate-fade-in-down " : "hidden"}`

            }>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Nueva Solución</h4>

                <button
                    onClick={() => closeForm()}
                    className={`p-2 absolute right-8 top-7 rounded-full transition-all duration-300 hover:scale-110 bg-gray-100 hover:bg-gray-200  dark:bg-gray-700 dark:hover:bg-gray-600 `}
                >
                    <X className="w-5 h-5" />
                </button>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor={"title"} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                id={"title"}
                                {...register("title", { required: "Title is required", },)}
                                className="w-full  px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Título de la solución..."

                            />
                            {errors.title && <p className="text-sm mt-3 mb-2 pl-1 text-red-500">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label htmlFor={"content"} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contenido
                            </label>
                            <textarea
                                id={"content"}
                                {...register("content", {
                                    required: "Content is required", minLength: {
                                        value: 5,
                                        message: "Content minimum length is 5"
                                    }
                                })}

                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Describe la solución en detalle..."
                            />

                            {errors.content && <p className="text-sm mt-1 mb-2 pl-1 text-red-500">{errors.content.message}</p>}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                        >

                            <Save className="w-4 h-4" />
                            <span>Guardar</span>
                        </button>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

        </>
    )
}




const StrokeIcon = () => {
    return (
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 stroke-gray-500  dark:stroke-gray-400  group-hover:stroke-blue-600 dark:group-hover:stroke-blue-400 transition-colors duration-300"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
    )
}