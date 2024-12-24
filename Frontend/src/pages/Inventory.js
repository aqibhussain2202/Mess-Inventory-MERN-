import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0); 
  const itemsPerPage = 5;

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage, currentPage]);

  // Fetching Products with Pagination
  const fetchProductsData = () => {
    fetch(
      `http://localhost:4000/api/product/get/${authContext.user}?page=${currentPage}&limit=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data.products);
        setTotalProducts(data.totalProducts);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Stores
  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  // Search Products
  const fetchSearchData = () => {
    fetch(
      `http://localhost:4000/api/product/search/${authContext.user}?query=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data.products);
        setTotalProducts(data.totalProducts);
      })
      .catch((err) => console.log(err));
  };

  // Toggle Add Product Modal
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Toggle Update Product Modal
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete Product
  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => setUpdatePage(!updatePage))
      .catch((err) => console.log(err));
  };

  // Change Page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3"></div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={() => setUpdatePage(!updatePage)}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4">
              <span className="font-bold">Products</span>
              <div className="flex px-2 border-2 rounded-md">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 text-white p-2 text-xs rounded"
              onClick={addProductModalSetting}
            >
              Add Product
            </button>
          </div>

          <table className="min-w-full divide-y-2 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium">Products</th>
                <th className="px-4 py-2 text-left font-medium">Manufacturer</th>
                <th className="px-4 py-2 text-left font-medium">Stock</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Availability</th>
                <th className="px-4 py-2 text-left font-medium">More</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.manufacturer}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">
                    {product.stock > 0 ? "In Stock" : "Not in Stock"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className="text-green-700 cursor-pointer"
                      onClick={() => updateProductModalSetting(product)}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-600 px-2 cursor-pointer"
                      onClick={() => deleteItem(product._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center p-4">
            {Array.from({ length: Math.ceil(totalProducts / itemsPerPage) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-2 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
