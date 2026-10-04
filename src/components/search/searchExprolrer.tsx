"use client";

import { useState, type ChangeEvent } from "react";
import type { CategoryFilterValue } from "../../types/type_infoProduct";
import CategoryFilter from "../filter/CategoryFilter";
import ProductCard from "../Product/ProductCard";
import { useProductCatalog } from "@/context/ProductCatalogContext";

export default function ProductExplorer() {
    const { products } = useProductCatalog();

    // ช่องค้นหาสินค้า
    const [keyword, setKeyword] = useState("");

    // หมวดหมู่ที่เลือก
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryFilterValue>("");

    // รูปแบบการเรียงราคา
    const [sortPrice, setSortPrice] = useState("");

    function handleKeywordChange(event: ChangeEvent<HTMLInputElement>) {
        setKeyword(event.target.value);
    }

    const searchText = keyword.trim().toLowerCase();

    // ค้นหาและกรองสินค้าตามหมวดหมู่
    const filteredProducts = products.filter((product) => {
        const matchesKeyword =
            product.Name.toLowerCase().includes(searchText) ||
            product.Category.toLowerCase().includes(searchText);

        const matchesCategory =
            !selectedCategory || product.Category === selectedCategory;

        return matchesKeyword && matchesCategory;
    });

    // เรียงสินค้าตามราคา
    const visibleProducts = [...filteredProducts].sort((a, b) => {
        if (sortPrice === "low-to-high") {
            return a.Price - b.Price;
        }

        if (sortPrice === "high-to-low") {
            return b.Price - a.Price;
        }

        return 0;
    });

    return (
        <div>
            <div className="searchControls">
                <input
                    className="searchInput"
                    type="search"
                    aria-label="ค้นหาสินค้า"
                    value={keyword}
                    onChange={handleKeywordChange}
                    placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่สินค้า"
                />

                <CategoryFilter
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                />

                <select
                    className="sortSelect"
                    aria-label="เรียงสินค้าตามราคา"
                    value={sortPrice}
                    onChange={(event) => setSortPrice(event.target.value)}
                >
                    <option value="">เรียงตามราคา</option>
                    <option value="low-to-high">
                        ราคาน้อย → มาก
                    </option>
                    <option value="high-to-low">
                        ราคามาก → น้อย
                    </option>
                </select>
            </div>

            {visibleProducts.length === 0 ? (
                <p>ไม่พบสินค้า</p>
            ) : (
                <section
                    className="productGrid"
                    aria-label="ผลการค้นหาสินค้า"
                >
                    {visibleProducts.map((product) => (
                        <ProductCard
                            key={`${product.Name}-${product.Name}`}
                            product={product}
                        />
                    ))}
                </section>
            )}
        </div>
    );
}

