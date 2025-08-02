
import { navigate } from "astro:transitions/client";
import { Trash2 } from "lucide-preact";
import { setSelectedNote,selectedNote } from "@/stores/notes-store";
import { useStore } from "@nanostores/preact";
import { closeSidenav } from "@/stores/sidenav-store";
import type { Note } from "@/utils/types/types";


export const DeleteButton = ({ id, endpoint }: { id: number, endpoint: string }) => {
  const $selectedNote = useStore(selectedNote) as Note

  const handleClick = async () => {

    try {
      const res = await fetch(`/api/${id}/${endpoint}`, {
        method: "DELETE",
      });


      if(res.status !== 200) {
        alert("Error al eliminar el recurso");
        return;
      }

      if (!(endpoint === "solution")) {
        navigate(window.location.href);
        return
      }


      const index = $selectedNote.solutions.findIndex((solution) => solution.id === id);
      const newSolutions =$selectedNote.solutions.toSpliced(index, 1);
      setSelectedNote({ ...$selectedNote, solutions: newSolutions})
      closeSidenav()
      return  navigate(window.location.href);



    } catch (error) {

    }


  }

  return (
    <button
      onClick={handleClick}
      className="delete-button cursor-pointer bg-red-500 flex text-white px-3 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >




      <Trash2 class="w-5 h-5" />
    </button>






  )
}




