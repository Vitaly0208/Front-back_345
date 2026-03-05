import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import UsersPage from "./pages/UsersPage";

function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px" }}>
                <Link to="/products" style={{ marginRight: "15px" }}>Товары</Link>
                <Link to="/users">Пользователи</Link>
            </nav>

            <Routes>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/" element={<UsersPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;