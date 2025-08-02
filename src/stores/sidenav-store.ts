import { atom } from "nanostores";

export const isSidenavOpen = atom(false);

export const closeSidenav = () => {
  isSidenavOpen.set(false);
};

export const openSidenav = () => {
   isSidenavOpen.set(true);
};
