import { closeSidenav, isSidenavOpen,openSidenav } from "@/stores/sidenav-store";
import { selectedNote } from "@/stores/notes-store";
import { useStore } from '@nanostores/preact';
import { Calendar,  X, ChevronRight } from 'lucide-preact';


export function SidenavNotes() {
    const $isSidenavOpen = useStore(isSidenavOpen);
    const $selectedNote = useStore(selectedNote);
  
 
   

  return (

    <>
      {
        $isSidenavOpen && (
          <div
            className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm  transition-opacity duration-300"
            onClick={closeSidenav}
          />
        )
      }

      {/* Sidenav */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl z-150 transform transition-transform duration-300 ease-in-out bg-white/95 border-l border-gray-200/50   dark:bg-gray-900/95  dark:border-gray-700/50 ${ $isSidenavOpen ? "translate-x-0" : "translate-x-full"
          }  backdrop-blur-md`}
      >
        {
          selectedNote && (
            <div className="h-full flex flex-col">
              {/* Sidenav Header */}
              <div
                className={`p-6 border-b border-gray-200/50 dark:border-gray-700/50`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-2xl font-bold text-white dark:text-gray-900 `}>
                    Soluciones
                  </h2>
                  <button
                    onClick={closeSidenav}
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 `}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div
                  className={`p-4 rounded-xl border bg-gray-50/50 border-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700/50`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 text-gray-900 dark:text-white`}
                  >
                    {$selectedNote?.title}
                  </h3>
                  <p className={`text-sm text-gray-600 dark:text-gray-300`}>
                    {$selectedNote?.description}
                  </p>
                </div>
              </div>

              {/* Solutions Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {$selectedNote?.solutions.map((solution, index) => (
                    <div
                      key={solution.id}
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02]  bg-white/80 border-gray-200/50 hover:border-gray-300/50 hover:bg-white  dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:border-gray-600/50 dark:hover:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Solution gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl bg-green-100 border border-green-200 dark:bg-green-500/20  dark:border-green-500/30  transition-all duration-300 group-hover:scale-110`}
                          >
                            <ChevronRight
                              className={`w-5 h-5 dark:text-green-400 text-green-600`}
                            />
                          </div>
                          <div
                            className={`text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 `}
                          >
                            Solución #{solution.id}
                          </div>
                        </div>

                        <h4
                          className={`text-xl font-bold mb-3 dark:text-white text-gray-900`}
                        >
                          {solution.title}
                        </h4>

                        <p
                          className={`text-sm leading-relaxed mb-4 dark:text-gray-300 text-gray-600`}
                        >
                          {solution.content}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Calendar
                              className={`w-3 h-3 dark:text-gray-400 text-gray-500`}
                            />
                            <span
                              className={
                                "dark:text-gray-400 text-gray-500"
                              }
                            >
                              Creado: 
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }
      </div>


    </>
  )
}
