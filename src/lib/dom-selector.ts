    
/*/
@param selector: string
@returns HTMLElement

@description
Selects the first element that matches the specified CSS selector in the document.

@example
const element = $<HTMLElement>(".my-element");

/*/
export const $ = (selector:string,  ) => document.querySelector(selector);


/*/
@param selector: string
@returns NodeListOf<HTMLElement>

@description
Selects all elements that match the specified CSS selector in the document.

@example
const elements = $$(".my-element");
/*/

export const $$ = (selector:string) => document.querySelectorAll(selector);
