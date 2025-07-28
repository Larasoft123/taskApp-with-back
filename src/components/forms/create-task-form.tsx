
import { Calendar, FileText, Tag, ListTodo } from "lucide-preact";
import { useForm } from 'react-hook-form';
import { navigate } from "astro:transitions/client"
import { useEffect, useState } from "preact/hooks";

// Definimos los tipos basados en el schema.prisma para mayor seguridad
type Status = "PENDING" | "IN_PROGRESS" | "DONE";
type TypeTask = "ONCE" | "DAYLY";

interface Tag {
  id: number;
  name: string;
}

interface CreateTaskFormProps {

  edit?: boolean;
  taskId?: number;
  // Podrías añadir una función `onSubmitSuccess` para manejar el estado en el componente padre
  // onSubmitSuccess?: (newTask: any) => void;
}
type CreateTaskFormData = { title: string; description?: string; status: Status; type: TypeTask, tags: number[] };
export function CreateTaskForm({ edit = false, taskId }: CreateTaskFormProps) {





  const { reset, setValue, control, register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CreateTaskFormData>({
    defaultValues: {
      tags: []
    }
  })
  const [disponibleTags, setDisponibleTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])


  useEffect(() => {
    const fetchData = async () => {
      // 1. Obtener todas las etiquetas disponibles
      try {
        const tagsRes = await fetch('/api/tags');
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json();
          setDisponibleTags(tagsData);
        }
      } catch (error) {
        console.error("Fallo al obtener las etiquetas:", error);
      }

      // 2. Si estamos en modo edición, obtener los datos de la tarea
      if (edit && taskId) {
        try {
          const taskRes = await fetch(`/api/${taskId}/task`);
          const data = await taskRes.json();
          const { title, type, description, status, tags } = data;
          setValue("title", title);
          setValue("type", type);
          setValue("description", description);
          setValue("status", status);

          // Pre-seleccionar las etiquetas existentes de la tarea
          if (tags && Array.isArray(tags)) {
            const tagIds = tags.map((tag: Tag) => tag.id);
            setSelectedTags(tagIds);
            setValue("tags", tagIds);
          }
        } catch (error) {
          console.error("Fallo al obtener los datos de la tarea:", error);
        }
      }
    };

    fetchData();
  }, [edit, taskId, setValue]);

  const handleTagClick = (tagId: number) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId) // Deseleccionar
      : [...selectedTags, tagId]; // Seleccionar
    setSelectedTags(newSelectedTags);
    setValue("tags", newSelectedTags, { shouldValidate: true });
  };


  const onSubmit = async (data: CreateTaskFormData) => {
    const { title, description, status, type, tags } = data






    if (!edit) {
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
          tags // Asegúrate de que el backend pueda manejar esto
        }),
      });

      if (res.status !== 200) return

      reset()
      navigate(window.location.href)
      return
    }

    const res = await fetch(`/api/${taskId}/task`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        description,
        status,
        type,
        tags // Asegúrate de que el backend pueda manejar esto
      })
    });

    if (res.status !== 200) return

    reset()
    navigate(window.location.href)
  }


  return (
    <article className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg px-20 py-2">
      <header className="pr-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{!edit ? 'Crear Nueva Tarea' : 'Editar Tarea Existente'} </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{!edit ? 'Completa los detalles para añadir una nueva tarea a tu lista.' : 'rellena los campos que quieres actualizar de la tarea'} </p>
      </header>

      <div>
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Tag className="w-4 h-4" /> Etiquetas (Selecciona una o más)
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 min-h-[40px]">
              {disponibleTags.length > 0 ? (
                disponibleTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800 ring-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay etiquetas disponibles. Crea una primero.</p>
              )}
            </div>
          </div>



          {errors && <p className="text-sm text-red-500">{errors.root?.message}</p>}

          <div className="flex justify-end gap-x-6 pt-2">
            
            <a href={"/dashboard"} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </a>


            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Guardando...' : edit ? "Editar Tarea" : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}