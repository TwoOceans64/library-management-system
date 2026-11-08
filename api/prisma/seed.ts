import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const books = [
  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '9780547928227', genre: 'Fantasy' },
  { title: 'A Wizard of Earthsea', author: 'Ursula K. Le Guin', isbn: '9780547773742', genre: 'Fantasy' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', isbn: '9780756404741', genre: 'Fantasy' },
  { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', isbn: '9780765350381', genre: 'Fantasy' },
  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593', genre: 'Science Fiction' },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595', genre: 'Science Fiction' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125', genre: 'Science Fiction' },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357', genre: 'Science Fiction' },
  // Mystery
  { title: 'The Big Sleep', author: 'Raymond Chandler', isbn: '9780394758282', genre: 'Mystery' },
  { title: 'And Then There Were None', author: 'Agatha Christie', isbn: '9780062073488', genre: 'Mystery' },
  { title: 'The Hound of the Baskervilles', author: 'Arthur Conan Doyle', isbn: '9780141034317', genre: 'Mystery' },
  { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '9780307588371', genre: 'Mystery' },
  // Biography
  { title: 'Educated', author: 'Tara Westover', isbn: '9780399590504', genre: 'Biography' },
  { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', genre: 'Biography' },
  { title: 'Born a Crime', author: 'Trevor Noah', isbn: '9780399588174', genre: 'Biography' },
  { title: 'Steve Jobs', author: 'Walter Isaacson', isbn: '9781451648539', genre: 'Biography' },
];

async function main() {
  // Clear existing data so the seed can be re-run
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const genreNames = ['Fantasy', 'Science Fiction', 'Mystery', 'Biography'];
  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
      }),
    ),
  );

  for (const book of books) {
    const genre = genres.find((g) => g.name === book.genre)!;
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: `${book.title} by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 3,
        genreId: genre.id,
      },
    });
  }

  // Placeholder hashes only; real passwords must be hashed before storing
  await prisma.user.create({
    data: { email: 'librarian@example.com', password: 'hashed-password-placeholder', role: 'LIBRARIAN' },
  });
  await prisma.user.create({
    data: { email: 'patron@example.com', password: 'hashed-password-placeholder', role: 'PATRON' },
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