# React Autocomplete with Debounce

This project is a demo of a smart product search field, similar to Amazon's, built with React. The application displays dynamic suggestions as the user types and optimizes API calls using a debounce function.

**Note:** Only the frontend code is available on GitHub. The backend is not included or published.

## Features

- **Search Field**: Users can search for products by typing their names.
- **Dynamic Suggestions**: A dropdown shows matching products in real time as you type.
- **Debounce**: API requests are delayed by 500ms after the last keystroke, reducing the number of calls and improving performance.
- **Routing**: Navigation between the homepage and product detail page using React Router.
- **Product Detail**: View detailed information for each selected product.

## Project Structure

- `src/App.jsx`: Handles routing between pages.
- `src/pages/homepage.jsx`: Implements the search field with suggestions and debounce.
- `src/pages/product-detail.jsx`: Displays details for a selected product.

## How to run locally

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ex-react-usecallback-autocomplete
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Backend not available**
   - The backend API (`http://localhost:3333/products` and `/products/:id`) is **not** included or published.
   - The search and product detail features will **not work** unless you provide a compatible backend yourself.

4. **Start the React application**
   ```bash
   npm run dev
   ```

## Usage

- Type a product name in the search field.
- View suggestions in the dropdown and select a product to see its details.
- Click a product in the list to access its detail page.

## Tech Stack

- **React 19.1.1**
- **React Router 7.8.1**: For client-side routing.
- **Axios 19.1.1**: For making HTTP requests to the backend API.

## struttura progetto:

### 📘 React Autocomplete — Scheda Ripasso

### 1. **Debounce**

```js
function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(value), delay);
  };
}
```

debounce è una high Order function (ritorna una nuova funzione).

La funzione ritornata ricorda la variabile **timer** grazie a una closure → ogni volta che viene richiamata cancella il timer precedente e ne imposta uno nuovo.

Risultato: la callback parte solo quando l’utente smette di scrivere per almeno delay ms.

👉 È un “buffer” che ritarda l’azione finché non passa un certo tempo dall’ultimo input.
quindi Serve per **ritardare** l’esecuzione di una funzione.  

in questo caso: evita chiamate API continue mentre l’utente digita.

---

### 2. **Stati principali**

* `query`: testo digitato dall’utente
* `products`: lista di prodotti da mostrare in pagina
* `suggestions`: lista di prodotti suggeriti (autocomplete)

---

### 3. **Flusso**

1. Utente scrive → `setQuery` aggiorna lo stato.
2. `useEffect` ascolta `query` → chiama `debouncedGetProducts(query)`.
3. Dopo 500ms → `getProducts(query)` fa chiamata API.
4. Aggiorno sia `products` che `suggestions`.
5. JSX mostra:

   * `products` sempre sotto
   * `suggestions` solo se `query.length > 0 && suggestions.length > 0`.

---

### 4. **Click su un suggerimento**

```js
const handleSuggestionClick = (product) => {
  setQuery(product.name);   // autocompleta input
  setSuggestions([]);       // nasconde tendina
  getProducts(product.name, setProducts); // aggiorna lista principale
};
```

---

### 5. **Conditional rendering**

```jsx
{query.length > 0 && suggestions.length > 0 && (
  <div className="suggestion-box">...</div>
)}
```

➡️ Mostra la tendina **solo se** c’è testo e ci sono suggerimenti.

---

## Flowchart — Autocomplete con debounce

```
[Utente digita in input]
          |
          v
   aggiorna query
          |
          v
   useEffect scatta
   (dipende da query)
          |
          v
 debouncedGetProducts(query)
   (ritardo 500ms)
          |
          v
 getProducts(query):
   - chiama API
   - aggiorna products
   - aggiorna suggestions
          |
          v
[SUGGERIMENTI visibili?]
  query.length > 0
  suggestions.length > 0
          |
     +----+----+
     |         |
   SI           NO
   |             |
 Mostra box      Non mostra nulla
 con lista
          |
          v
[Click su suggerimento]
   - setQuery(product.name)
   - setSuggestions([])
   - getProducts(product.name, setProducts)
          |
          v
  Aggiorna lista principale
```

---

## 🔍 Focus su **useEffect**

```js
useEffect(() => {
  debouncedGetProducts(query)
}, [query, debouncedGetProducts])
```

* `query` → ogni volta che cambia la stringa digitata, devo rifare la ricerca.
* `debouncedGetProducts` → è la funzione “memorizzata” da `useCallback`.
  👉 Se non la metto tra le dipendenze, React potrebbe usare una versione “vecchia” della funzione.

📌 Quindi: effetto parte quando cambia **cosa cerco (query)** o **il modo in cui cerco (debouncedGetProducts)**.

---

## 🔍 Focus su  **handleSuggestionClick**

```js
const handleSuggestionClick = (product) => {
  setQuery(product.name);            // scrive il nome nel box ricerca
  setSuggestions([]);                // svuota la tendina suggerimenti
  getProducts(product.name, setProducts); // ricarica i prodotti principali
};
```

1. **Perché passo `product.name` a getProducts?**

   * L’utente ha scelto un prodotto specifico.
   * Quindi non serve più tutta la query → basta il nome del prodotto (stringa).

2. **Perché passo `setProducts` e non `setSuggestions`?**

   * Ora non devo più mostrare suggerimenti, ma solo la lista principale dei prodotti corrispondenti.
   * I suggerimenti li ho già svuotati con `setSuggestions([])`.

3. **Perché non uso `debouncedGetProducts`?**

   * Qui non voglio ritardo → l’utente ha fatto click, quindi la ricerca dev’essere immediata.
   * `debouncedGetProducts` serve solo quando scrivi, non quando confermi la scelta.

