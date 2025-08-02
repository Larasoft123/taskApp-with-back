import { useForm } from 'react-hook-form';
import { ListTodo, Palette, Sparkles } from "lucide-preact";
import { navigate } from 'astro:transitions/client';
import { useState } from 'preact/hooks';


type CreateTagFormData = { name: string; color: string };
export function CreateTagForm() {

    const { reset, register, handleSubmit, setValue, getValues, formState: { isSubmitting } } = useForm<CreateTagFormData>({
        defaultValues: {
            color: '#4f46e5' // Un color por defecto (indigo-600)
        }
    })


    const onSubmit = async (data: CreateTagFormData) => {
        const { name, color } = data


        const res = await fetch("/api/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                color
            }),
        });

        if (res.status !== 200) return
        const result = await res.json()
        console.log(result)

        reset()
        return navigate(window.location.href)


    }

    const [isGeneratingColor, setIsGeneratingColor] = useState(false);

    const handleGenerateColor = async () => {
        const tagName = getValues("name");
        if (!tagName) {
            // Opcional: mostrar un error si el nombre está vacío
            alert("Por favor, introduce un nombre para la etiqueta antes de generar un color.");
            return;
        }

        setIsGeneratingColor(true);
        try {
            // Simulación de llamada a la API. Reemplaza esto con tu endpoint real.
            // const response = await fetch('/api/tags/generate-color', {
            //     method: 'POST',
            //     body: JSON.stringify({ name: tagName })
            // });
            // const { color } = await response.json();

            // Simulación de respuesta
            await new Promise(resolve => setTimeout(resolve, 1500));
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            setValue('color', randomColor, { shouldDirty: true });

        } catch (error) {
            console.error("Error al generar el color:", error);
        } finally {
            setIsGeneratingColor(false);
        }
    };


    return (
        <article className="w-full max-w-2xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg p-6 sm:p-8">
            <header className="pb-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">crear nueva etiqueta</h2>
                <p className="mt-1 text-sm text-pretty text-gray-500 dark:text-gray-400">completa los detalles para añadir una nueva etiqueta a tu lista y asociar una tarea a ella</p>
            </header>

            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="py-8 space-y-8">
                    <div className="">
                        <div className="space-y-2 flex flex-col sm:flex-row sm:gap-8">
                        
                        
                         <div className="flex-1" >

                                <label htmlFor="name" className="flex items-center mb-2 gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <ListTodo className="w-4 h-4" /> Nombre
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name', { required: "El nombre es requerido" })}
                                    placeholder="Ej: comida, gimnasio, trabajo"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
                                    required
                                />
                            </div>


                            <div className={"min-w-32"}>
                                <label htmlFor="color" className="flex items-center mb-2 gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <Palette className="w-4 h-4" /> Color
                                </label>
                                <div className="space-y-4">
                                    <input
                                        id="color"
                                        type="color"
                                        {...register('color')}
                                        className="h-12 w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-1 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800"
                                        disabled={isGeneratingColor}
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="space-y-2 md:mt-4 mt-8">

                            <button
                                type="button"
                                onClick={handleGenerateColor}
                                disabled={isGeneratingColor}
                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-wait disabled:opacity-75 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {isGeneratingColor ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="truncate">Generando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                        <span className="truncate">Generar con IA</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Creando...' : 'Crear Etiqueta'}
                        </button>
                    </div>
                </form>
            </div>
        </article>
    )
}
