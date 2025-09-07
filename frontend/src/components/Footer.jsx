export default function Footer() {
  return (
    <footer className="py-6 bg-indigo-600 dark:bg-indigo-700 text-white text-center transition-colors duration-500">
      <p>&copy; {new Date().getFullYear()} QuizNet. All rights reserved.</p>
    </footer>
  );
}
