import { useState,  } from "preact/hooks";
import { type FormEvent } from "preact/compat"
import { Calendar, FileText, Tag, ListTodo } from "lucide-preact";

// Definimos los tipos basados en el schema.prisma para mayor seguridad
type Status = "PENDING" | "IN_PROGRESS" | "DONE";
type TypeTask = "ONCE" | "DAYLY";

// interface CreateTaskFormProps {
//   userId: string;
//   // Podrías añadir una función `onSubmitSuccess` para manejar el estado en el componente padre
//   // onSubmitSuccess?: (newTask: any) => void;
// }

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("PENDING");
  const [type, setType] = useState<TypeTask>("ONCE");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const taskData = {
      title,
      description,
      status,
      type,

    };

    try {
      // Aquí harías la llamada a tu API endpoint de Astro
      // const response = await fetch('/api/tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(taskData),
      // });
      // if (!response.ok) throw new Error('Error al crear la tarea');
      // const newTask = await response.json();
      
      // Simulando una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Tarea enviada:", taskData);

      // Limpiar formulario y notificar al padre (si es necesario)
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setType("ONCE");
      // onSubmitSuccess?.(newTask);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl   mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg px-12 py-2">
      <div className="pr-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Tarea</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Completa los detalles para añadir una nueva tarea a tu lista.</p>
      </div>

      <form onSubmit={handleSubmit} className="pr-6 py-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ListTodo className="w-4 h-4" /> Titulo 
          </label>
          <input
            id="title"
            type="text"
            value={title}
            // onChange={(e) => setTitle(e?.target?.value)}
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
            value={description}
            // onChange={(e) => setDescription(e?.target?.value)}
            rows={4}
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
            // value={status} onChange={(e) => setStatus(e?.target?.value as Status)} 
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
            <select id="type" value={type} 
            // onChange={(e) => setType(e?.target?.value as TypeTask)} 
            className="w-full text-black px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
              <option value="ONCE">Única</option>
              <option value="DAYLY">Diaria</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Guardando...' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}