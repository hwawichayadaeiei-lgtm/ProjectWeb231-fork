"use client";

import Image from "next/image";
import { useProductCatalog } from "@/context/ProductCatalogContext";
import type { PurchaseStatus } from "@/context/ProductCatalogContext";

export default function PurchaseHistoryPage() {
    const { purchases, updatePurchaseStatus } = useProductCatalog();

    function handleStatusChange(
        purchaseId: number,
        status: PurchaseStatus
    ) {
        updatePurchaseStatus(purchaseId, status);
    }

    return (
        <main className="purchaseHistoryPage">
            <h1>ประวัติการซื้อ</h1>

            {purchases.length === 0 ? (
                <p>ยังไม่มีประวัติการซื้อ</p>
            ) : (
                <section className="purchaseHistoryList">
                    {purchases.map((purchase) => (
                        <article
                            className="purchaseHistoryCard"
                            key={purchase.id}
                        >
                            {purchase.product.image ? (
                                <div className="purchaseHistoryImage">
                                    <Image
                                        src={purchase.product.image}
                                        alt={purchase.product.Name}
                                        fill
                                        sizes="120px"
                                    />
                                </div>
                            ) : (
                                <div className="purchaseHistoryImage">
                                    ไม่มีรูป
                                </div>
                            )}

                            <div className="purchaseHistoryInfo">
                                <h2>{purchase.product.Name}</h2>

                                <p>
                                    ราคา: ฿
                                    {purchase.product.Price.toLocaleString(
                                        "th-TH"
                                    )}
                                </p>

                                <p>
                                    วันที่ซื้อ: {purchase.purchaseDate}
                                </p>

                                <p>
                                    สถานะ:{" "}
                                    <strong>{purchase.status}</strong>
                                </p>

                                <label className="purchaseStatusLabel">
                                    เปลี่ยนสถานะ
                                    <select
                                        className="purchaseStatusSelect"
                                        value={purchase.status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                purchase.id,
                                                event.target
                                                    .value as PurchaseStatus
                                            )
                                        }
                                    >
                                        <option value="กำลังเตรียมสินค้า">
                                            กำลังเตรียมสินค้า
                                        </option>
                                        <option value="กำลังจัดส่ง">
                                            กำลังจัดส่ง
                                        </option>
                                        <option value="จัดส่งแล้ว">
                                            จัดส่งแล้ว
                                        </option>
                                    </select>
                                </label>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

