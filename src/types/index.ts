/**
 * La tâche créée par l'utilisateur.
 * L'interface est stricte mais Task pourra fournir des valeurs par défaut
 */

export namespace TpTask {
  export interface Props {
    name: string;
    due_date?: Date;
    priority?: 0 | 1 | 2;
    tags?: string[];
    description?: string;
  }
  export interface Type {
    getName: () => string;
    getDueDate: (toString?: boolean) => Date | string;
    getPriority: () => 0 | 1 | 2;
    getDescription: () => string;
    getTags: () => string[];
    hasTag: (tag: string) => boolean;
  }
}
