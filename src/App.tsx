import { Button, Icon, Layout } from "@stellar/design-system";
import "./App.module.css";
import ConnectAccount from "./components/ConnectAccount.tsx";
import { Routes, Route, Outlet, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Carriers from "./pages/Carriers";
import About from "./pages/About.tsx";
import CargoTrustLogo from "./components/CargoTrustLogo.tsx";
import "./database/testDatabase"; // Importar teste do banco

const AppLayout: React.FC = () => (
  <main>
    <Layout.Header
      projectId="CARGO TRUST"
      projectTitle="Meridian Delivery"
      contentRight={
        <>
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink
              to="/carriers"
              style={{
                textDecoration: "none",
              }}
            >
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={() => (window.location.href = "/carriers")}
                  disabled={isActive}
                >
                  <Icon.Truck01 size="md" />
                  Transportadores
                </Button>
              )}
            </NavLink>
            <NavLink
              to="/about"
              style={{
                textDecoration: "none",
              }}
            >
              {({ isActive }) => (
                <Button
                  variant="tertiary"
                  size="md"
                  onClick={() => (window.location.href = "/about")}
                  disabled={isActive}
                >
                  <Icon.Users01 size="md" />
                  Sobre Nós
                </Button>
              )}
            </NavLink>
          </nav>
          <ConnectAccount />
        </>
      }
    />
    <Outlet />
    <Layout.Footer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
        <CargoTrustLogo size="sm" showText={false} />
        <span>
          © {new Date().getFullYear()} Meridian Delivery. Plataforma descentralizada de entregas powered by blockchain.{" "}
          <a
            href="http://www.apache.org/licenses/LICENSE-2.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache License, Version 2.0
          </a>
          .
        </span>
      </div>
    </Layout.Footer>
  </main>
);

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/carriers" element={<Carriers />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
