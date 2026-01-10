/* eslint-disable no-var */

// Augment the global scope variables
declare var name: string;

// Augment GlobalThis interface
interface GlobalThis {
    name: string;
}

// Augment Window interface (just in case)
interface Window {
    name: string;
}

declare namespace NodeJS {
    interface Global {
        name: string;
    }
}