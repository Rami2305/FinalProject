export const VALID_CATEGORIES = [
    'General',
    'Mathematics',
    'Sports',
    'Geography',
    'History'
] as const;

export type ValidCategory = typeof VALID_CATEGORIES[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;


export type Difficulty = typeof DIFFICULTIES[number];

export const categoryIds: Record<ValidCategory, number> = {
    'General': 9,
    'Mathematics': 19,
    'Sports': 21,
    'Geography': 22,
    'History': 23
};