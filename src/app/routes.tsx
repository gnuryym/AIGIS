import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { EarnPage } from "./pages/EarnPage";
import { MarketPage } from "./pages/MarketPage";
import { TradePage } from "./pages/TradePage";
import { DerivativesPage } from "./pages/DerivativesPage";
import { FinancePage } from "./pages/FinancePage";
import { WalletProfilePage } from "./pages/WalletProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: EarnPage },
      { path: "market", Component: MarketPage },
      { path: "trade", Component: TradePage },
      { path: "derivatives", Component: DerivativesPage },
      { path: "finance", Component: FinancePage },
      { path: "wallet", Component: WalletProfilePage },
    ],
  },
]);
