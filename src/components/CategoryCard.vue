<template>
    <div class="category-card">
      <h3>{{ category.name }}</h3>
      <p>{{ category.description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "CategoryCard", 
    props: {
      category: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .category-card {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
  }
  
  .category-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .category-card p {
    font-size: 16px;
    color: #666;
  }
  </style>
  