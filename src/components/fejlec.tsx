type pages = "kezdolap" | "admin" | "moderator"

interface HeaderProps {
  oldal: pages;
  setOldal: (page: pages) => void;
}

export default function Fejlect({ oldal, setOldal }: HeaderProps) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar">
        <div className="container">
          <span className="navbar-brand fw-bold"><span className="brand-mark">I</span> Italok</span>
          <div className="navbar-nav">
            {([
              ["kezdolap", "Kezdőlap"],
              ["admin", "Admin"],
              ["moderator", "Moderátor"],
            ] as const).map(([page, label]) => (
              <button
                className={`nav-link btn app-nav-link ${oldal === page ? "active" : ""}`}
                onClick={() => setOldal(page)}
                key={page}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
