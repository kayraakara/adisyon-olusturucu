


let menu = JSON.parse(localStorage.getItem("menu")) || [];


const categoriesContainer = document.getElementById("categoriesContainer");


const createCategoryBtn = document.getElementById("createCategoryBtn");

createCategoryBtn.addEventListener("click", () => {


  const categoryName = document.getElementById("categoryName").value.trim();
  if (!categoryName) return alert("Kategori adı giriniz.");

  if (menu.some(m => m.category === categoryName)) {

    return;
  }

  createCategoryBox(categoryName);
  document.getElementById("categoryName").value = "";
});



function createCategoryBox(categoryName) {



  const box = document.createElement("div");
  box.className = "category-box";

  box.innerHTML = `
    <h3><span class="category-title">${categoryName}</span>
      <button class="editCatBtn"><i class="bi bi-pencil-square"></i></button>
      <button class="deleteCatBtn"><i class="bi bi-trash3"></i></button>
    </h3>
    <input type="text" class="itemNameInput" placeholder="Ürün adı">
    <input type="number" class="itemPriceInput price-narrow" placeholder="Fiyat" min="0">
    
<div class="custom-file-wrapper">
  <input type="file" class="itemImageInput" accept="image/*" id="fileInput_${categoryName}" style="display: none;">
  <label for="fileInput_${categoryName}" class="file-label-btn">
    <i class="bi bi-image"></i> Resim Seç
  </label>
  
</div>

<button class="addToCategoryBtn">Ürün Ekle</button>
    <ul class="categoryItemList"></ul>
  `;

  categoriesContainer.appendChild(box);


  const imageInput = box.querySelector(".itemImageInput");


  const fileLabel = box.querySelector(".file-label-btn");

  imageInput.addEventListener("change", () => {
    if (imageInput.files.length > 0) {


      const fileName = imageInput.files[0].name;
      fileLabel.innerHTML = `<i class="bi bi-image"></i> ${fileName}`;
      showToast("Seçili resim ürüne eklendi ✅");
    }
  });




  const itemList = box.querySelector(".categoryItemList");


  const addBtn = box.querySelector(".addToCategoryBtn");


  const deleteCatBtn = box.querySelector(".deleteCatBtn");


  const editCatBtn = box.querySelector(".editCatBtn");


  const titleSpan = box.querySelector(".category-title");

  addBtn.addEventListener("click", () => {



    const itemName = box.querySelector(".itemNameInput").value.trim();


    const itemPrice = parseFloat(box.querySelector(".itemPriceInput").value);


    const imageFile = box.querySelector(".itemImageInput").files[0];

    if (!itemName || isNaN(itemPrice) || itemPrice < 0 || !imageFile) {

      return;
    }



    const reader = new FileReader();
    reader.onload = function(e) {
      const item = {
        name: itemName,
        price: itemPrice,
        image: e.target.result,
        category: categoryName
      };

            menu.push(item);
        localStorage.setItem("menu", JSON.stringify(menu));
        renderItem(itemList, item);
        box.querySelector(".itemNameInput").value = "";
        box.querySelector(".itemPriceInput").value = "";
        box.querySelector(".itemImageInput").value = null;
        fileLabel.innerHTML = `<i class="bi bi-image"></i> Resim Seç`; 
        showToast("Ürün eklendi ✅");
    };

    reader.readAsDataURL(imageFile);
  });

  deleteCatBtn.addEventListener("click", () => {
    if (!confirm(`${categoryName} kategorisini ve tüm ürünleri silmek istiyor musunuz?`)) return;
    menu = menu.filter(item => item.category !== categoryName);
    localStorage.setItem("menu", JSON.stringify(menu));
    box.remove();
  });

  editCatBtn.addEventListener("click", () => {


    const newName = prompt("Yeni kategori adı girin:", categoryName);
    if (!newName) return;

    menu.forEach(i => {
      if (i.category === categoryName) i.category = newName;
    });
    localStorage.setItem("menu", JSON.stringify(menu));
    titleSpan.textContent = newName;
  });



  const existingItems = menu.filter(i => i.category === categoryName);
  existingItems.forEach(i => renderItem(itemList, i));
}



function renderItem(ul, item) {


  const li = document.createElement("li");
  li.innerHTML = `
    ${item.name} - ${item.price.toFixed(2)} TL
    <button class="editItemBtn"><i class="bi bi-pencil-square"></i></button>
    <button class="editImageBtn"><i class="bi bi-image"></i></button>
    <button class="deleteItemBtn"><i class="bi bi-trash3"></i></button>
  `;



  const deleteBtn = li.querySelector(".deleteItemBtn");
  deleteBtn.onclick = () => {


    const idx = menu.findIndex(i => i.name === item.name && i.category === item.category);
    if (idx > -1) {
      menu.splice(idx, 1);
      localStorage.setItem("menu", JSON.stringify(menu));
      li.remove();
      showToastFalse("Ürün çıkarıldı ❌");
      
    }
  };



  const editBtn = li.querySelector(".editItemBtn");
editBtn.onclick = () => {


  const newName = prompt("Yeni ürün adı girin:", item.name);
  if (newName && newName !== item.name) {
    item.name = newName;
    localStorage.setItem("menu", JSON.stringify(menu));
    li.childNodes[0].textContent = `${item.name} - ${item.price.toFixed(2)} TL`;
    showToast("Ürün ismi değiştirildi ✅");
  }
};




  const editImageBtn = li.querySelector(".editImageBtn");
  editImageBtn.onclick = () => {


    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {


      const file = e.target.files[0];
      if (file) {


        const reader = new FileReader();
        reader.onload = function(ev) {
          item.image = ev.target.result;
          localStorage.setItem("menu", JSON.stringify(menu));
          showToast("Ürün resmi değiştirildi ✅");

        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    
  };

  ul.appendChild(li);
  
}

function showToast(message) {


  let toastTrue = document.getElementById("toastTrue");
  if (!toastTrue) {
    toastTrue = document.createElement("div");
    toastTrue.id = "toastTrue";
    toastTrue.className = "toastTrue";
    document.body.appendChild(toastTrue);
  }

  toastTrue.textContent = message;
  toastTrue.classList.add("show");

  setTimeout(() => {
    toastTrue.classList.remove("show");
  }, 1500);
}


function showToastFalse(message) {


  let toastFalse = document.getElementById("toastFalse");
  if (!toastFalse) {
    toastFalse = document.createElement("div");
    toastFalse.id = "toastFalse";
    toastFalse.className = "toastFalse";
    document.body.appendChild(toastFalse);
  }

  toastFalse.textContent = message;
  toastFalse.classList.add("show");

  setTimeout(() => {
    toastFalse.classList.remove("show");
  }, 1500);
}


document.addEventListener("DOMContentLoaded", () => {

  const categories = [...new Set(menu.map(i => i.category))];
  categories.forEach(c => createCategoryBox(c));
});