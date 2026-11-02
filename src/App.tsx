import { useState } from "react"
import type { FormEvent } from "react"
import Fejlect from "./components/fejlec"
import Lablec from "./components/lablec"

import type { ital } from "./ital"

const italok: ital[] = [
  { nev: "Cola", gyarto: "Coca-Cola", ar: 450, cukormentes: false },
  { nev: "Fanta", gyarto: "Coca-Cola", ar: 430, cukormentes: false },
  { nev: "Sprite Zero", gyarto: "Coca-Cola", ar: 450, cukormentes: true },
  { nev: "Nestea citrom", gyarto: "Nestea", ar: 500, cukormentes: false },
  { nev: "Hell Classic", gyarto: "Hell Energy", ar: 390, cukormentes: false },
]

type pages = "kezdolap" | "admin" | "moderator"

function App() {
  const [oldal, setOldal] = useState<pages>("kezdolap")
  const [italLista, setItalLista] = useState<ital[]>(italok)
  const [szerkesztettIndex, setSzerkesztettIndex] = useState<number | null>(null)
  const [ujItal, setUjItal] = useState<ital>({
    nev: "",
    gyarto: "",
    ar: 0,
    cukormentes: false,
  })

  const adatValtozas = (mezo: keyof ital, ertek: string | number | boolean) => {
    setUjItal((elozo) => ({ ...elozo, [mezo]: ertek }))
  }

  const mentes = (esemeny: FormEvent<HTMLFormElement>) => {
    esemeny.preventDefault()
    if (!ujItal.nev.trim() || !ujItal.gyarto.trim() || ujItal.ar <= 0) return

    if (szerkesztettIndex === null) {
      setItalLista((elozo) => [...elozo, ujItal])
    } else {
      setItalLista((elozo) =>
        elozo.map((italAdat, index) => index === szerkesztettIndex ? ujItal : italAdat),
      )
    }
    formAlaphelyzet()
  }

  const szerkesztes = (index: number) => {
    setSzerkesztettIndex(index)
    setUjItal(italLista[index])
    setOldal("admin")
  }

  const torles = (index: number) => {
    setItalLista((elozo) => elozo.filter((_, italIndex) => italIndex !== index))
    if (szerkesztettIndex === index) formAlaphelyzet()
  }

  const logikaiMezoValtasa = (index: number) => {
    setItalLista((elozo) =>
      elozo.map((italAdat, italIndex) =>
        italIndex === index ? { ...italAdat, cukormentes: !italAdat.cukormentes } : italAdat,
      ),
    )
  }

  function formAlaphelyzet() {
    setSzerkesztettIndex(null)
    setUjItal({ nev: "", gyarto: "", ar: 0, cukormentes: false })
  }

  const lista = (muveletek = false, kapcsolo = false) => (
    <div className="table-responsive app-table-wrap">
      <table className="table table-hover align-middle app-table">
        <thead>
          <tr>
            <th>Név</th><th>Gyártó</th><th>Ár</th><th>Cukormentes</th>
            {(muveletek || kapcsolo) && <th>Műveletek</th>}
          </tr>
        </thead>
        <tbody>
          {italLista.map((italAdat, index) => (
            <tr key={`${italAdat.nev}-${index}`}>
              <td>{italAdat.nev}</td>
              <td>{italAdat.gyarto}</td>
              <td>{italAdat.ar} Ft</td>
              <td>
                <span className={`badge status-badge ${italAdat.cukormentes ? "status-yes" : "status-no"}`}>
                  {italAdat.cukormentes ? "Igen" : "Nem"}
                </span>
              </td>
              {(muveletek || kapcsolo) && (
                <td className="d-flex gap-2">
                  {muveletek && <>
                    <button className="btn btn-sm btn-warning" onClick={() => szerkesztes(index)}>Szerkesztés</button>
                    <button className="btn btn-sm btn-danger" onClick={() => torles(index)}>Törlés</button>
                  </>}
                  {kapcsolo && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => logikaiMezoValtasa(index)}>
                      {italAdat.cukormentes ? "legyen cukormentes" : "legyen cukros"}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const adminForm = (
    <form className="card card-body shadow-sm mb-4 app-card" onSubmit={mentes}>
      <h2 className="h4 section-title">{szerkesztettIndex === null ? "Új ital felvétele" : "Ital módosítása"}</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label" htmlFor="nev">Név</label>
          <input id="nev" className="form-control" value={ujItal.nev} onChange={(e) => adatValtozas("nev", e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="gyarto">Gyártó</label>
          <input id="gyarto" className="form-control" value={ujItal.gyarto} onChange={(e) => adatValtozas("gyarto", e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="ar">Ár (Ft)</label>
          <input id="ar" type="number" min="1" className="form-control" value={ujItal.ar || ""} onChange={(e) => adatValtozas("ar", Number(e.target.value))} required />
        </div>
        <div className="col-12 form-check ms-2">
          <input id="cukormentes" type="checkbox" className="form-check-input" checked={ujItal.cukormentes} onChange={(e) => adatValtozas("cukormentes", e.target.checked)} />
          <label className="form-check-label" htmlFor="cukormentes">Cukormentes</label>
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">{szerkesztettIndex === null ? "Hozzáadás" : "Mentés"}</button>
        {szerkesztettIndex !== null && <button className="btn btn-secondary" type="button" onClick={formAlaphelyzet}>Mégse</button>}
      </div>
    </form>
  )

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Fejlect oldal={oldal} setOldal={setOldal} />
      <main className="container py-4 flex-grow-1 app-main">
        {oldal === "kezdolap" && <><div className="hero"><p className="eyebrow">FRISSÍTŐ VÁLASZTÉK</p><h1>Találd meg a kedvenc italod.</h1><p>Egyszerűen áttekinthető kínálat, minden fontos adattal.</p></div>{lista()}</>}
        {oldal === "admin" && <><h1 className="page-title">Adminisztráció</h1>{adminForm}<h2 className="h4 section-title">Rekordok</h2>{lista(true)}</>}
        {oldal === "moderator" && <><h1 className="page-title">Moderátor</h1><p className="text-muted">A logikai mező állapotát itt kapcsolhatod.</p>{lista(false, true)}</>}
      </main>
      <Lablec />
    </div>
  )
}

export default App