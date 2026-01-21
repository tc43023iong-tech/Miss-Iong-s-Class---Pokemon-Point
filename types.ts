
export interface Student {
  id: string; // class_id_studentNumber
  name: string;
  studentNumber: number;
  pokemonId: number;
  totalScore: number;
  posCount: number;
  negCount: number;
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export enum SortType {
  ID_ASC = 'ID_ASC',
  SCORE_DESC = 'SCORE_DESC',
  SCORE_ASC = 'SCORE_ASC'
}

export interface Behavior {
  label: string;
  labelEn: string;
  points: number;
}
