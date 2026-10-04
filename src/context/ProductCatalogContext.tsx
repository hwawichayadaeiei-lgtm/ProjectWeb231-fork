"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { infoproduct } from "@/Data/infoproduct";
import type { InfoProduct } from "@/types/type_infoProduct";

// สถานะของคำสั่งซื้อ
export type PurchaseStatus =
    | "กำลังเตรียมสินค้า"
    | "กำลังจัดส่ง"
    | "จัดส่งแล้ว";

// ข้อมูลสินค้าที่ซื้อ
export type Purchase = {
    id: number;
    product: InfoProduct;
    purchaseDate: string;
    status: PurchaseStatus;
};

type ProductCatalogContextValue = {
    products: InfoProduct[];
    myPosts: InfoProduct[];
    purchases: Purchase[];
    addProduct: (product: InfoProduct) => void;
    buyProduct: (product: InfoProduct) => void;
    updatePurchaseStatus: (
        purchaseId: number,
        status: PurchaseStatus
    ) => void;
};

const ProductCatalogContext =
    createContext<ProductCatalogContextValue | null>(null);

export function ProductCatalogProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [products, setProducts] = useState<InfoProduct[]>(infoproduct);
    const [myPosts, setMyPosts] = useState<InfoProduct[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // โหลดประวัติการซื้อจาก localStorage
    useEffect(() => {
        const savedPurchases = localStorage.getItem("purchaseHistory");

        if (savedPurchases) {
            try {
                setPurchases(JSON.parse(savedPurchases));
            } catch {
                setPurchases([]);
            }
        }

        setIsLoaded(true);
    }, []);

    // บันทึกประวัติการซื้อ หลังจากโหลดข้อมูลเสร็จแล้ว
    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            "purchaseHistory",
            JSON.stringify(purchases)
        );
    }, [purchases, isLoaded]);

    function addProduct(product: InfoProduct) {
        setProducts((currentProducts) => [
            product,
            ...currentProducts,
        ]);

        setMyPosts((currentPosts) => [
            product,
            ...currentPosts,
        ]);
    }

    // ซื้อสินค้า
    function buyProduct(product: InfoProduct) {
        const newPurchase: Purchase = {
            id: Date.now(),
            product,
            purchaseDate: new Date().toLocaleDateString("th-TH"),
            status: "กำลังเตรียมสินค้า",
        };

        setPurchases((currentPurchases) => [
            newPurchase,
            ...currentPurchases,
        ]);
    }

    // เปลี่ยนสถานะคำสั่งซื้อ
    function updatePurchaseStatus(
        purchaseId: number,
        status: PurchaseStatus
    ) {
        setPurchases((currentPurchases) =>
            currentPurchases.map((purchase) =>
                purchase.id === purchaseId
                    ? {
                          ...purchase,
                          status,
                      }
                    : purchase
            )
        );
    }

    return (
        <ProductCatalogContext.Provider
            value={{
                products,
                myPosts,
                purchases,
                addProduct,
                buyProduct,
                updatePurchaseStatus,
            }}
        >
            {children}
        </ProductCatalogContext.Provider>
    );
}

export function useProductCatalog() {
    const context = useContext(ProductCatalogContext);

    if (!context) {
        throw new Error(
            "useProductCatalog must be used inside ProductCatalogProvider"
        );
    }

    return context;
}

