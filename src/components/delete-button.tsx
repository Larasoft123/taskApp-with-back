
import { navigate } from "astro:transitions/client";
import { Trash2 } from "lucide-preact";

export const DeleteButton = ({ id }: { id: number }) => {

  const handleClick = async () => {

    try {
      const res = await fetch(`/api/${id}/task`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data);
      navigate(window.location.href);

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



 
