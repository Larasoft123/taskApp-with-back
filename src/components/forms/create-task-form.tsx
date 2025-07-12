
import { Calendar, FileText, Tag, ListTodo } from "lucide-preact";
import type { FormEvent } from "preact/compat";
import { useForm } from 'react-hook-form';
// Definimos los tipos basados en el schema.prisma para mayor seguridad
type Status = "PENDING" | "IN_PROGRESS" | "DONE";
type TypeTask = "ONCE" | "DAYLY";

interface CreateTaskFormProps {

  edit?: boolean;
  // Podrías añadir una función `onSubmitSuccess` para manejar el estado en el componente padre
  // onSubmitSuccess?: (newTask: any) => void;
}

export function CreateTaskForm({edit=false}: CreateTaskFormProps) {

  type CreateTaskFormData = { title: string; description?: string; status: Status; type: TypeTask };

  const { reset, register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CreateTaskFormData>()


  const onSubmit = async (data: CreateTaskFormData) => {
    const { title, description, status, type } = data


    

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        status,
        type,
      }),
    });

    const json = await res.json();
    console.log(json)

    console.log(res.status)

    
   
    reset()
  }


  return (
    <div className="w-full max-w-2xl   mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg px-12 py-2">
      <div className="pr-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Tarea</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Completa los detalles para añadir una nueva tarea a tu lista.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pr-6 py-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ListTodo className="w-4 h-4" /> Titulo
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: true })}

            placeholder="Ej: Diseñar la nueva landing page"
            className="w-full px-3 py-2 bg-gray-50 text-black dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText className="w-4 h-4" /> Descripción (Opcional)
          </label>
          <textarea
            id="description"

            {...register('description')}

            rows={3}
            placeholder="Añade más detalles sobre la tarea..."
            className="w-full  px-3 py-2 bg-gray-50 text-black dark:bg-gray-800 border border-gray-300 dark:border-gray-600 resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4" /> Estado
            </label>

            <select id="status"
              {...register('status', { required: true })}
              className="w-full text-black px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="DONE">Hecho</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" /> Tipo
            </label>
            <select id="type"
              {...register('type', { required: true })}
              className="w-full text-black px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="ONCE">Única</option>
              <option value="DAYLY">Diaria</option>
            </select>
          </div>
        </div>

        {errors && <p className="text-sm text-red-500">{errors.root?.message}</p>}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Guardando...' : edit ? "Editar Tarea" : "Crear Tarea"}
          </button>
        </div>
      </form>
    </div>
  );
}