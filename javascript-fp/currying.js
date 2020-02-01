const enormousProductsDataSet = [
    {
      name: "Brioche Pasquier",
      category: "Viennoiseries",
      creationDate: 1517516185
    },
    {
      name: "Danonino à la fraise",
      category: "Yaourts",
      creationDate: 1643746585
    }
    // and a TRILLION more items
];

// ============= //
// WITHOUT CURRYING
// ============= //

const orderProductsOfCategoryByCreationDate = (
    products,
    category,
    ordering = "asc"
  ) => {
    // expensive operation for a huge dataset
    const filteredProducts = products.filter(p => p.category === category);
  
    return filteredProducts.sort((a, b) =>
      ordering === "asc"
        ? a.creationDate - b.creationDate
        : b.creationDate - a.creationDate
    );
};
  
// repetition of all arguments for each call, call to expensive filtering for each call... :/
orderProductsOfCategoryByCreationDate(enormousProductsDataSet, "Viennoiseries", "asc");
orderProductsOfCategoryByCreationDate(enormousProductsDataSet, "Viennoiseries", "desc");




// ============= //
//  WITH CURRYING
// ============= //

const orderProductsOfCategoryByCreationDate = products => category => {
    // expensive operation for a huge dataset
    const filteredProducts = products.filter(p => p.category === category);
  
    return (ordering = "asc") =>
      filteredProducts.sort((a, b) =>
        ordering === "asc"
          ? a.creationDate - b.creationDate
          : b.creationDate - a.creationDate
      );
};

// expensive filtering of products is made here, only once
const orderYaourtsByCreationDate = curry(orderProductsOfCategoryByCreationDate)(
    enormousProductsDataSet,
    "Yaourts"
);

// no repetition, no filtering for each call
orderYaourtsByCreationDate("asc");
orderYaourtsByCreationDate("desc");
  