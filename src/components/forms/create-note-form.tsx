
import { Calendar, FileText, Tag, ListTodo } from "lucide-preact";
import { useForm } from 'react-hook-form';
import { navigate } from "astro:transitions/client"
import { useEffect, useState } from "preact/hooks";

// Definimos los tipos basados en el schema.prisma para mayor seguridad

interface Tag {
  id: number;
  name: string;
}

interface CreateTaskFormProps {

  edit?: boolean;
  noteId?: number;
  // Podrías añadir una función `onSubmitSuccess` para manejar el estado en el componente padre
  // onSubmitSuccess?: (newTask: any) => void;
}
type CreateTaskFormData = { title: string; description?: string;  tags: number[],  };


export function CreateNoteForm({ edit = false, noteId }: CreateTaskFormProps) {





  const { reset, setValue, control, register, handleSubmit, formState: { isSubmitting, errors } } = useForm<CreateTaskFormData>({
    defaultValues: {
      tags: [],
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
        console.log("obetiendo tags")
      } catch (error) {
        console.error("Fallo al obtener las etiquetas:", error);
      }

      // 2. Si estamos en modo edición, obtener los datos de la tarea
      if (edit && noteId) {
        try {
          const noteRed = await fetch(`/api/${noteId}/note`);
          const data = await noteRed.json();
          const { title,  description, tags } = data;
          setValue("title", title);
          setValue("description", description);
   
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
  }, [edit, noteId, setValue]);

  const handleTagClick = (tagId: number) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId) // Deseleccionar
      : [...selectedTags, tagId]; // Seleccionar
    setSelectedTags(newSelectedTags);
    setValue("tags", newSelectedTags, { shouldValidate: true });
  };


  const onSubmit = async (data: CreateTaskFormData) => {
    const { title, description, tags } = data






    if (!edit) {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,   
          tags 
        }),
      });

      if (res.status !== 200) return

      reset()
      navigate(window.location.href)
      return
    }

    const res = await fetch(`/api/${noteId}/note`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        description,

        tags 
      })
    });

    if (res.status !== 200) return

    reset()
    navigate("/notes")
  }


  return (
    <article className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg px-20 py-2">
      <header className="pr-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{!edit ? 'Crear Nueva Nota' : 'Editar Nota Existente'} </h2>
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
            
            <a href={"/notes"} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </a>


            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Guardando...' : edit ? "Editar Nota" : "Crear Nota"}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}