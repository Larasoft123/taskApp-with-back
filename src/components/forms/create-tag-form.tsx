import { useForm } from 'react-hook-form';
import { Calendar, FileText, Tag, ListTodo } from "lucide-preact";
import { navigate } from 'astro:transitions/client';


type CreateTaskFormData = { name: string };
export function CreateTagForm() {

    const { reset, register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CreateTaskFormData>()


    const onSubmit = async (data: CreateTaskFormData) => {
        const {name} = data
        
        const res = await fetch("/api/tags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
            }),
        });

        if (res.status !== 200) return
        const result= await res.json()
        console.log(result)

        reset()
        return navigate(window.location.href)
        
  
    }
    
    
    return (
        <article className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg md:px-20 px-10 py-2">
            <header className="md:pr-6 py-2 md:py-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">crear nueva etiqueta</h2>
                <p className="mt-1 text-sm text-pretty text-gray-500 dark:text-gray-400">completa los detalles para añadir una nueva etiqueta a tu lista y asociar una tarea a ella</p>
            </header>

            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="pr-6 py-6 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <ListTodo className="w-4 h-4" /> Nombre
                        </label>
                        <input
                            id="name"
                            type="text"
                            {...register('name', { required: true })}
                            placeholder="Ej: comida, gimnasio, trabajo"
                            className="w-full px-3 py-2 bg-gray-50 text-black dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            required
                        />
                    </div>



                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            Crear Tag
                        </button>
                    </div>
                </form>
            </div>
        </article>
    )
}
