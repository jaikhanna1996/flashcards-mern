import dotenv from 'dotenv';
import mongooseConnect from '../config/db';
import Deck from '../models/Deck';
import Flashcard from '../models/Flashcard';

dotenv.config();

const reactFlashcards = [
  {
    question: 'What is React & why it exists?',
    answer: 'React is a JavaScript library for building user interfaces, particularly web applications. It exists to make it easier to create interactive UIs with reusable components.',
    details: 'React was created by Facebook in 2013 to solve the problem of building complex, interactive user interfaces. It uses a component-based architecture where UI is broken down into reusable pieces. React uses a virtual DOM to efficiently update only the parts of the UI that changed, making applications faster and more responsive.',
    difficulty: 'easy' as const,
    tags: ['basics', 'introduction'],
  },
  {
    question: 'What is JSX?',
    answer: 'JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like code in JavaScript.',
    details: 'JSX is not HTML - it gets transpiled to JavaScript. It allows you to write declarative UI code that looks like HTML but is actually JavaScript. Babel converts JSX into React.createElement() calls. Example: <div>Hello</div> becomes React.createElement("div", null, "Hello").',
    difficulty: 'easy' as const,
    tags: ['jsx', 'basics'],
  },
  {
    question: 'What are Functional Components vs Class Components?',
    answer: 'Functional components are JavaScript functions that return JSX. Class components are ES6 classes that extend React.Component.',
    details: 'Functional components (preferred): Simple functions, use hooks for state/lifecycle, less code, better performance. Class components (legacy): Use this.state and lifecycle methods, more verbose. React now recommends functional components with hooks.',
    difficulty: 'medium' as const,
    tags: ['components', 'hooks'],
  },
  {
    question: 'What is the difference between Props and State?',
    answer: 'Props are data passed from parent to child (read-only). State is data managed within a component (can be updated).',
    details: 'Props: Immutable, passed down from parent, used for configuration. State: Mutable, managed internally with useState hook, triggers re-renders when updated. Props flow down, state stays local.',
    difficulty: 'medium' as const,
    tags: ['props', 'state', 'basics'],
  },
  {
    question: 'What is useState?',
    answer: 'useState is a React hook that allows functional components to have state.',
    details: 'useState returns an array with two elements: [stateValue, setStateFunction]. The state value persists between renders. When you call the setter function, React re-renders the component with the new state. Example: const [count, setCount] = useState(0);',
    difficulty: 'medium' as const,
    tags: ['hooks', 'useState', 'state'],
  },
  {
    question: 'What is useEffect?',
    answer: 'useEffect is a hook that lets you perform side effects in functional components (like API calls, subscriptions, DOM manipulation).',
    details: 'useEffect runs after every render by default. You can control when it runs using the dependency array. Empty array [] = runs once on mount. Array with values = runs when those values change. Return a cleanup function to clean up subscriptions.',
    difficulty: 'medium' as const,
    tags: ['hooks', 'useEffect', 'side-effects'],
  },
];

// Node.js flashcards data
const nodejsFlashcards = [
  {
    question: 'What is Node.js?',
    answer: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that allows you to run JavaScript on the server.',
    details: 'Node.js enables JavaScript to run outside the browser, on servers. It uses an event-driven, non-blocking I/O model making it efficient for building scalable network applications. It has a large ecosystem of packages via npm.',
    difficulty: 'easy' as const,
    tags: ['basics', 'introduction'],
  },
  {
    question: 'What is the Event Loop?',
    answer: 'The Event Loop is Node.js\'s mechanism for handling asynchronous operations. It continuously checks the call stack and callback queue.',
    details: 'The event loop allows Node.js to perform non-blocking I/O operations. It has phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks. Callbacks are executed when the call stack is empty.',
    difficulty: 'hard' as const,
    tags: ['async', 'event-loop', 'advanced'],
  },
  {
    question: 'What is npm?',
    answer: 'npm (Node Package Manager) is the default package manager for Node.js, used to install and manage dependencies.',
    details: 'npm comes with Node.js installation. It manages packages in node_modules folder, tracks dependencies in package.json. Commands: npm install, npm start, npm run script. npm registry hosts thousands of open-source packages.',
    difficulty: 'easy' as const,
    tags: ['npm', 'packages', 'basics'],
  },
];

// MongoDB flashcards data
const mongodbFlashcards = [
  {
    question: 'What is MongoDB?',
    answer: 'MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents.',
    details: 'MongoDB is a document-oriented database. Instead of tables and rows, it uses collections and documents. Documents are stored in BSON format (Binary JSON). It\'s schema-less, meaning documents in a collection can have different structures.',
    difficulty: 'easy' as const,
    tags: ['basics', 'introduction'],
  },
  {
    question: 'What is a Document in MongoDB?',
    answer: 'A document is a record in MongoDB. It\'s a set of key-value pairs, similar to a JSON object.',
    details: 'Documents are the basic unit of data in MongoDB. They are stored in BSON format. A document can contain nested documents and arrays. Example: { name: "John", age: 30, address: { city: "NYC" } }',
    difficulty: 'easy' as const,
    tags: ['basics', 'documents'],
  },
  {
    question: 'What is a Collection in MongoDB?',
    answer: 'A collection is a group of MongoDB documents, similar to a table in relational databases.',
    details: 'Collections are like tables in SQL databases. They don\'t enforce a schema, so documents within a collection can have different structures. Collections are created automatically when you first insert a document.',
    difficulty: 'easy' as const,
    tags: ['basics', 'collections'],
  },
  {
    question: 'What is Mongoose?',
    answer: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that provides a schema-based solution.',
    details: 'Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, and business logic hooks. It makes working with MongoDB easier by providing a schema layer.',
    difficulty: 'medium' as const,
    tags: ['mongoose', 'odm', 'nodejs'],
  },
];

async function seedDatabase() {
  try {
    await mongooseConnect();
    console.log('✅ Connected to MongoDB');

    const existingDefaultDecks = await Deck.find({ type: 'default' });
    if (existingDefaultDecks.length > 0) {
      console.log('⚠️  Default decks already exist. Skipping seed.');
      console.log(`📚 Found ${existingDefaultDecks.length} default deck(s):`);
      for (const deck of existingDefaultDecks) {
        const cardCount = await Flashcard.countDocuments({ deckId: deck._id });
        console.log(`   - ${deck.name}: ${cardCount} flashcards`);
      }
      console.log('\n💡 To reseed, delete default decks first or modify the seed script.');
      process.exit(0);
    }

    const reactDeck = await Deck.create({
      name: 'React',
      description: 'Learn React fundamentals, hooks, and best practices',
      type: 'default',
      userId: null,
      flashcards: [],
    });

    const reactCards = await Flashcard.insertMany(
      reactFlashcards.map((card) => ({
        ...card,
        deckId: reactDeck._id,
        userId: null,
      }))
    );

    reactDeck.flashcards = reactCards.map((card) => card._id);
    await reactDeck.save();
    console.log(`✅ Created React deck with ${reactCards.length} flashcards`);

    const nodejsDeck = await Deck.create({
      name: 'Node.js',
      description: 'Learn Node.js fundamentals, async programming, and server-side JavaScript',
      type: 'default',
      userId: null,
      flashcards: [],
    });

    const nodejsCards = await Flashcard.insertMany(
      nodejsFlashcards.map((card) => ({
        ...card,
        deckId: nodejsDeck._id,
        userId: null,
      }))
    );

    nodejsDeck.flashcards = nodejsCards.map((card) => card._id);
    await nodejsDeck.save();
    console.log(`✅ Created Node.js deck with ${nodejsCards.length} flashcards`);

    const mongodbDeck = await Deck.create({
      name: 'MongoDB',
      description: 'Learn MongoDB basics, documents, collections, and Mongoose',
      type: 'default',
      userId: null,
      flashcards: [],
    });

    const mongodbCards = await Flashcard.insertMany(
      mongodbFlashcards.map((card) => ({
        ...card,
        deckId: mongodbDeck._id,
        userId: null,
      }))
    );

    mongodbDeck.flashcards = mongodbCards.map((card) => card._id);
    await mongodbDeck.save();
    console.log(`✅ Created MongoDB deck with ${mongodbCards.length} flashcards`);

    console.log('\n🎉 Seed completed successfully!');
    console.log(`📚 Created 3 default decks:`);
    console.log(`   - React: ${reactCards.length} flashcards`);
    console.log(`   - Node.js: ${nodejsCards.length} flashcards`);
    console.log(`   - MongoDB: ${mongodbCards.length} flashcards`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

