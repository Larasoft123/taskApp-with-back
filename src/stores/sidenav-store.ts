import { atom } from "nanostores";

export const isSidenavOpen = atom(true);

export const closeSidenav = () => {
  isSidenavOpen.set(false);
};

export const openSidenav = () => {
   isSidenavOpen.set(true);
};
