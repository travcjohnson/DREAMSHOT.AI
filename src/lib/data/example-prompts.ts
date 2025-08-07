export interface ExamplePrompt {
  id: string;
  text: string;
  category: string;
  submissions: number;
  improvement: string;
  gpt3Output: string;
  gpt4Output: string;
  claude3Output?: string;
  trendingScore?: number;
}

export const examplePrompts: ExamplePrompt[] = [
  {
    id: 'limerick-debug',
    text: 'Write a limerick about debugging',
    category: 'Creative Writing',
    submissions: 3847,
    improvement: '427% more clever',
    gpt3Output: 'There once was a bug in my code\nThat made my computer explode\nI tried to debug\nWith coffee and shrug\nBut still down that error road',
    gpt4Output: 'A developer sat with great pride\nTill undefined crawled up beside\n  "Cannot read null!"\n  His hopes took a fall\nNow he console.logs far and wide'
  },
  {
    id: 'explain-blockchain',
    text: 'Explain blockchain like I\'m 5',
    category: 'Education',
    submissions: 5921,
    improvement: '312% clearer',
    gpt3Output: 'Blockchain is like a special notebook that everyone can see. When someone writes in it, everyone gets a copy.',
    gpt4Output: 'Imagine a magical coloring book that all your friends share. When you draw something, it appears in everyone\'s book at the same time. And once you draw something, no one can erase it - not even you! That\'s blockchain: everyone has the same book, and all the drawings stay forever.'
  },
  {
    id: 'python-reverse',
    text: 'Create a Python function to reverse a string',
    category: 'Code Generation',
    submissions: 8234,
    improvement: '256% better practices',
    gpt3Output: 'def reverse(s):\n    return s[::-1]',
    gpt4Output: 'def reverse_string(text: str) -> str:\n    """Reverse a string using Python\'s slice notation.\n    \n    Args:\n        text: The string to reverse\n        \n    Returns:\n        The reversed string\n        \n    Examples:\n        >>> reverse_string("hello")\n        \'olleh\'\n    """\n    if not isinstance(text, str):\n        raise TypeError(f"Expected str, got {type(text).__name__}")\n    return text[::-1]'
  },
  {
    id: 'quantum-simple',
    text: 'What is quantum computing in one sentence?',
    category: 'Science',
    submissions: 2156,
    improvement: '189% more accurate',
    gpt3Output: 'Quantum computing uses quantum bits to perform calculations faster than regular computers.',
    gpt4Output: 'Quantum computing harnesses superposition and entanglement to process information in fundamentally parallel ways, enabling certain calculations that would take classical computers millennia to complete in mere hours.'
  },
  {
    id: 'haiku-javascript',
    text: 'Write a haiku about JavaScript',
    category: 'Creative Writing',
    submissions: 4521,
    improvement: '385% more poetic',
    gpt3Output: 'JavaScript runs fast\nVariables everywhere\nBrowser language good',
    gpt4Output: 'Undefined awaits\nCallbacks nest in promises—\nAwait brings us peace'
  },
  {
    id: 'startup-name',
    text: 'Generate a startup name for a dog walking app',
    category: 'Business',
    submissions: 1893,
    improvement: '523% more creative',
    gpt3Output: 'DogWalker, PuppySteps, WalkMyDog',
    gpt4Output: 'Pawpath, Fetchr, WoofWalk, TailTrails, BarkBuddy, SnoutRoute, PupTrek, LeashLink'
  },
  {
    id: 'sql-join',
    text: 'Explain SQL JOIN types',
    category: 'Technical',
    submissions: 6234,
    improvement: '267% more comprehensive',
    gpt3Output: 'INNER JOIN: matches both tables\nLEFT JOIN: all from left table\nRIGHT JOIN: all from right table',
    gpt4Output: 'INNER JOIN: Returns only matching rows from both tables\nLEFT JOIN: Returns all rows from left table, matched rows from right (NULLs for non-matches)\nRIGHT JOIN: Returns all rows from right table, matched rows from left\nFULL OUTER JOIN: Returns all rows from both tables, NULLs where no match\nCROSS JOIN: Cartesian product - every row from first table paired with every row from second'
  },
  {
    id: 'recipe-simple',
    text: 'Give me a recipe using only eggs, flour, and milk',
    category: 'Cooking',
    submissions: 3421,
    improvement: '412% more detailed',
    gpt3Output: 'Mix eggs, flour, and milk. Cook in pan. Makes pancakes.',
    gpt4Output: 'Classic Crepes: Whisk 2 eggs until smooth. Gradually add 1 cup flour, mixing to avoid lumps. Slowly pour in 1.5 cups milk, whisking constantly. Let batter rest 30 minutes. Heat buttered pan over medium heat. Pour 1/4 cup batter, swirl to coat pan. Cook 1-2 minutes per side until golden. Makes 8 thin crepes perfect for sweet or savory fillings.'
  },
  {
    id: 'meaning-life',
    text: 'What is the meaning of life?',
    category: 'Philosophy',
    submissions: 9999,
    improvement: '42% more profound',
    gpt3Output: 'The meaning of life is subjective and varies for each person. Common answers include happiness, love, and personal growth.',
    gpt4Output: 'While 42 might be the answer, the question itself reveals our deepest human need: to find purpose in our existence. Perhaps meaning isn\'t discovered but created—through our connections, contributions, and the courage to keep asking this very question.'
  },
  {
    id: 'cli-colors',
    text: 'How to add colors to terminal output in Python',
    category: 'Code',
    submissions: 5672,
    improvement: '378% more practical',
    gpt3Output: 'Use colorama library: pip install colorama',
    gpt4Output: 'from colorama import init, Fore, Style\ninit()  # Windows compatibility\n\nprint(Fore.RED + "Error message")\nprint(Fore.GREEN + "Success!" + Style.RESET_ALL)\nprint(f"{Fore.YELLOW}Warning:{Style.RESET_ALL} Check this")\n\n# Or use ANSI codes directly:\nprint("\\033[91mRed text\\033[0m")'
  }
];

export const categories = [
  'Creative Writing',
  'Code Generation',
  'Education',
  'Science',
  'Business',
  'Technical',
  'Philosophy',
  'Cooking'
];

export const recentActivity = [
  { time: '2 min ago', action: 'submitted', category: 'Code', prompt: 'Build a React hook for...' },
  { time: '5 min ago', action: 'submitted', category: 'Creative', prompt: 'Write a story about...' },
  { time: '7 min ago', action: 'viewed results', category: 'Business', prompt: 'Marketing strategy for...' },
  { time: '12 min ago', action: 'submitted', category: 'Science', prompt: 'Explain CRISPR to a...' },
  { time: '18 min ago', action: 'submitted', category: 'Code', prompt: 'Debug this TypeScript...' },
  { time: '23 min ago', action: 'submitted', category: 'Philosophy', prompt: 'If AI becomes conscious...' }
];

export function getRandomPrompts(count: number): ExamplePrompt[] {
  const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getTrendingPrompts(): ExamplePrompt[] {
  return examplePrompts
    .filter(p => p.submissions > 3000)
    .sort((a, b) => b.submissions - a.submissions)
    .slice(0, 5);
}