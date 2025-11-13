"use client"

import { Loader2, Search, X } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle, // <- import from your wrapper
} from "./ui/dialog"
import { Input } from "./ui/input"
import { client } from "@/sanity/lib/client"
import { Product } from "@/sanity.types"
import Link from "next/link"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import PriceView from "./PriceView"
import AddToCartButton from "./AddToCartButton"

export const SearchBar = () => {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Hydration-safe, deterministic ID
  const contentId = React.useId()

  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([])
      return
    }
    setLoading(true)
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)`
      const params = { search: `${search}*` }
      const response = await client.fetch(query, params)
      setProducts(response)
    } catch (error) {
      console.error("Error fetching products", error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [search, fetchProducts])

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogTrigger aria-controls={contentId}>
        <Search className="w-5 h-5 hover:text-[#151515] hoverEffect" />
      </DialogTrigger>

      {/* Give the content a stable id that matches aria-controls */}
      <DialogContent
        id={contentId}
        className="!max-w-4xl !w-full min-h-[90vh] max-h-[90vh] flex flex-col overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle className="mb-1">Product Searchbar</DialogTitle>

          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Search your product here..."
              className="flex-1 rounded-md py-5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <X
                onClick={() => setSearch("")}
                className="w-4 h-4 absolute top-3 right-11 hover:text-red-600 hoverEffect"
              />
            )}
            <button
              type="submit"
              className="absolute right-0 top-0 w-10 h-full flex items-center justify-center rounded-tr-md rounded-br-md hover:bg-black hover:text-white hoverEffect"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogHeader>

        <div className="w-full h-full overflow-y-scroll border border-darkColor/20 rounded-md">
          <div>
            {loading ? (
              <p className="flex items-center px-6 py-10 gap-1 text-center text-yellow-600 font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" /> Searching in progress...
              </p>
            ) : products.length ? (
              products.map((product: Product) => (
                <div
                  key={product?._id}
                  className="bg-white overflow-hidden border-b last:border-b-0 flex items-center justify-between px-4 py-3"
                >
                  {/* Left: Image + Info */}
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/product/${product?.slug?.current}`}
                      className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden group border"
                      onClick={() => setShowSearch(false)}
                    >
                      {product?.images && (
                        <Image
                          width={200}
                          height={200}
                          src={urlFor(product.images[0]).url()}
                          alt="productImage"
                          className="object-cover w-full h-full group-hover:scale-110 hoverEffect"
                        />
                      )}
                    </Link>
                    <div>
                      <Link
                        href={`/product/${product?.slug?.current}`}
                        onClick={() => setShowSearch(false)}
                      >
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
                          {product?.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-1">
                          {product?.intro}
                        </p>
                      </Link>
                      <PriceView
                        price={product?.price}
                        discount={product?.discount}
                        className="text-sm md:text-base mt-1"
                      />
                    </div>
                  </div>

                  {/* Right: Add to Cart */}
                  <div className="flex-shrink-0">
                    <AddToCartButton product={product} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 font-semibold tracking-wide">
                {search && !loading ? (
                  <p>
                    Nothing match with the keyword{" "}
                    <span className="underline text-red-600">{search}</span>. Try something else.
                  </p>
                ) : (
                  <p className="text-green-600 flex items-center justify-center gap-1">
                    <Search className="w-5 h-5" /> Search and explore your products
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}