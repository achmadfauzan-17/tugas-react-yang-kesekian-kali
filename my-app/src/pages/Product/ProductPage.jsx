import { useState, useEffect, useTransition } from "react";
import getAllProducts from "../../services/getAllProducts";
import CardList from "../../components/CardList/CardList";
import Navbar from "../../components/Navbar/Navbar";
import RadioButton from "../../components/RadioButton/RadioButton";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const radioButtonOpts = useRef([
    {
      label: "All",
      value: "all",
    },
  ]);

  const originalProucts = useRef([]);
  const [ispending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuaery, setSearchQuery] = useState("");

  useEffect(() => {
    function fetchAllProducts() {
      let allProducts = getAllProducts();
      allProducts = allProducts.length > 0 ? allProducts : [];
      // allProducts = []
      // Simpan data produk yang belum difilter
      originalProucts.current = allProducts;
      // Simpan data produk yang telah difilter
      setProducts(allProducts);
    }

    function fetchCategories() {
      const allcategories = getAllProductCategories;
      const newCategories = allcategories.map((cat) => ({ label: cat.name, value: cat.slug })).filter((newCat) => !radioButtonOpts.current.some((existingCat) => existingCat.value === newCat.value));
      radioButtonOpts.current = [...radioButtonOpts.current, ...newCategories];
    }

    console.log(radioButtonOpts.current);
    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    startTransition(() => {
      const filtered = originalProucts.current.filter((product) => {
        const matchedCategory = selectedCategory === "all" || product.categorySlug === selectedCategory;
        const matchedSearch = product.name.toLowerCase().includes(searchQuaery.toLocaleLowerCase());

        return matchedCategory && matchedSearch;
      });

      return setProducts(filtered);
    });
  }, [selectedCategory, searchQuaery]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  // const RadioButtonOpts = [

  //   {
  //     label: 'All',
  //     value: 'all'
  //   },
  //   {
  //     label: 'Men\'s Shoes',
  //     value: 'menshoes'
  //   },
  //   {
  //     label: 'Women\'s Shoes',
  //     value: 'womenshoes'
  //   },
  // ]

  return (
    <>
      <Navbar onSearchChange={handleSearchChange}></Navbar>
      <div className="px-24 py-4 gap-4 mt-4 flex-wrap">
        <h3 className="font-medium">Filter</h3>
        <div className="flex gap-2 flex-wrap">
          <RadioButton options={RadioButtonOpts.current} defaultValue={"all"} onChange={handleCategoryChange} />
        </div>
      </div>
      <section className="container px-24 py-4">
        <main className="grid grid-cols-4 gap-4">
          <CardList products={products} ispending={ispending} />
        </main>
      </section>
    </>
  );
}
