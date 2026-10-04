"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { InfoProduct } from "../../types/type_infoProduct";
import { useProductCatalog } from "@/context/ProductCatalogContext";

type ProductCardProps = {
    product: InfoProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // เรียกฟังก์ชันซื้อสินค้าจาก Context
    const { buyProduct } = useProductCatalog();

    useEffect(() => {
        if (!isDetailsOpen) return;

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsDetailsOpen(false);
            }
        }

        window.addEventListener("keydown", closeOnEscape);

        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isDetailsOpen]);

    // ฟังก์ชันเมื่อกดซื้อสินค้า
    function handleBuyProduct() {
        buyProduct(product);
        alert(`ซื้อ ${product.Name} สำเร็จ`);
        setIsDetailsOpen(false);
    }

    return (
        <>
            <article className="productCard">
                <button
                    className="productCardTrigger"
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setIsDetailsOpen(true)}
                >
                    <span className="productMedia">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.Name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="productImage"
                            />
                        ) : (
                            <span className="imagePlaceholder">
                                ไม่มีรูป
                            </span>
                        )}
                    </span>

                    <span className="productInfo">
                        <span className="productPrice">
                            ฿{product.Price.toLocaleString("th-TH")}
                        </span>

                        <span className="productTitle">
                            {product.Name}
                        </span>

                        <span className="productMeta">
                            {product.Category}
                        </span>
                    </span>
                </button>
            </article>

            {isDetailsOpen && (
                <div
                    className="productDialogBackdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsDetailsOpen(false);
                        }
                    }}
                >
                    <section
                        className="productDialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="productDialogTitle"
                    >
                        <div className="productDialogHeader">
                            <h2 id="productDialogTitle">
                                รายละเอียดสินค้า
                            </h2>

                            <button
                                className="productDialogClose"
                                type="button"
                                aria-label="ปิดหน้าต่าง"
                                onClick={() => setIsDetailsOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        {product.image ? (
                            <div className="productDialogMedia">
                                <Image
                                    src={product.image}
                                    alt={product.Name}
                                    fill
                                    sizes="(max-width: 640px) 90vw, 32rem"
                                />
                            </div>
                        ) : (
                            <div className="productDialogMedia productDialogPlaceholder">
                                ไม่มีรูป
                            </div>
                        )}

                        <h3 className="productDialogName">
                            {product.Name}
                        </h3>

                        <p className="productDialogPrice">
                            ฿{product.Price.toLocaleString("th-TH")}
                        </p>

                        <p className="productDialogCategory">
                            {product.Category}
                        </p>

                        <p className="productDialogDescription">
                            {product.Description}
                        </p>

                        {/* ปุ่มซื้อสินค้า */}
                        <button
                            className="buyProductButton"
                            type="button"
                            onClick={handleBuyProduct}
                        >
                            ซื้อสินค้า
                        </button>
                    </section>
                </div>
            )}
        </>
    );
}

