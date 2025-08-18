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

- **React**: Frontend library for building user interfaces.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests to the backend API.


