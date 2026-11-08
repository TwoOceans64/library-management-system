import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const genres = [
  { name: 'Science Fiction', description: 'Speculative futures and technology' },
  { name: 'Fantasy', description: 'Magic, myth and invented worlds' },
  { name: 'Mystery', description: 'Crime, detection and suspense' },
  { name: 'Non-Fiction', description: 'History, science and biography' },
];

const books = [
  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', year: 1965, genre: 'Science Fiction' },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', year: 1984, genre: 'Science Fiction' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', year: 1969, genre: 'Science Fiction' },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', year: 1951, genre: 'Science Fiction' },
  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', year: 1937, genre: 'Fantasy' },
  { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', isbn: '9780547773742', year: 1968, genre: 'Fantasy' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780756404741', year: 2007, genre: 'Fantasy' },
  { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', isbn: '9780765350381', year: 2006, genre: 'Fantasy' },
  // Mystery
  { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '9780141034317', year: 1902, genre: 'Mystery' },
  { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '9780062073488', year: 1939, genre: 'Mystery' },
  { title: 'The Big Sleep', author: 'Raymond Chandler', isbn: '9780394758282', year: 1939, genre: 'Mystery' },
  { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '9780307588371', year: 2012, genre: 'Mystery' },
  // Non-Fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316110', year: 2011, genre: 'Non-Fiction' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', year: 1988, genre: 'Non-Fiction' },
  { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', year: 1994, genre: 'Non-Fiction' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', year: 1976, genre: 'Non-Fiction' },
];

async function main() {
  // Clear existing data so the seed can be re-run
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const createdGenres = await Promise.all(
    genres.map((g) => prisma.genre.create({ data: g })),
  );

  for (const b of books) {
    const genre = createdGenres.find((g) => g.name === b.genre)!;
    await prisma.book.create({
      data: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        publishedYear: b.year,
        copiesAvailable: 3,
        genreId: genre.id,
      },
    });
  }

  await prisma.user.create({
    data: { email: 'librarian@example.com', name: 'Lena Librarian', role: 'LIBRARIAN' },
  });
  await prisma.user.create({
    data: { email: 'patron@example.com', name: 'Pat Patron', role: 'PATRON' },
  });

  console.log(`Seeded ${genres.length} genres and ${books.length} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });