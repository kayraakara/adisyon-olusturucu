// historyTracker.js


const bills = JSON.parse(localStorage.getItem("bills")) || [];
const menu = JSON.parse(localStorage.getItem("menu")) || [];
const billsContainer = document.getElementById("billsContainer");

let activeBillIndex = null;


function createBill() {



  const name = document.getElementById("customerName").value.trim();
  if (!name) return alert("Müşteri adı giriniz.");

  bills.push({ customer: name, items: [] });
  localStorage.setItem("bills", JSON.stringify(bills));
  document.getElementById("customerName").value = "";
  renderBills();
}




function renderBills() {
  billsContainer.innerHTML = "";
  billsContainer.style.display = "flex";
  billsContainer.style.flexWrap = "wrap";
  billsContainer.style.gap = "20px";

  bills.forEach((bill, index) => {



    const div = document.createElement("div");
    div.className = "bill-card";
    div.style.backgroundColor = "#2c2c2c";
    div.style.borderRadius = "12px";
    div.style.padding = "16px";
    div.style.width = "200px";
    div.style.color = "white";
    div.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";




    const h3 = document.createElement("h3");
    h3.style.fontSize = "18px";
    h3.textContent = bill.customer;




    const total = bill.items.reduce((sum, item) => sum + item.price * item.quantity, 0);



    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>${total.toFixed(2)} TL</strong>`;




    const detailBtn = document.createElement("button");
    detailBtn.textContent = "Detaylar";
    detailBtn.style.marginTop = "10px";
    detailBtn.style.backgroundColor = "#4caf50";
    detailBtn.style.color = "white";
    detailBtn.style.border = "none";
    detailBtn.style.padding = "6px 12px";
    detailBtn.style.borderRadius = "8px";
    detailBtn.style.cursor = "pointer";
    detailBtn.onclick = () => expandBill(index);




    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.style.marginTop = "10px";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.backgroundColor = "#f44336";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "6px 12px";
    deleteBtn.style.borderRadius = "8px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.onclick = () => {
      if (confirm(`"${bill.customer}" adisyonunu silmek istiyor musunuz?`)) {
        bills.splice(index, 1);
        saveBills();
        renderBills();
      }
    };

    div.appendChild(h3);
    div.appendChild(totalP);
    div.appendChild(detailBtn);
    div.appendChild(deleteBtn);
    billsContainer.appendChild(div);
  });
}




function expandBill(index) {



  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 1000;




  const box = document.createElement("div");
  box.className = "product-card";
  box.style.backgroundColor = "#1e1e1e";
  box.style.width = "500px";
  box.style.maxHeight = "80vh";
  box.style.overflowY = "auto";
  box.style.padding = "32px";
  box.style.borderRadius = "20px";
  box.style.boxShadow = "0 0 12px rgba(0, 0, 0, 0.6)";
  box.style.position = "relative";




  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "12px";
  closeBtn.style.right = "16px";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "white";
  closeBtn.style.fontSize = "20px";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => overlay.remove();




  const title = document.createElement("h2");
  title.textContent = bills[index].customer;
  title.style.marginBottom = "16px";




  const addBtn = document.createElement("button");
  addBtn.textContent = "Ürün Ekle";
  addBtn.style.backgroundColor = "#4caf50";
  addBtn.style.color = "white";
  addBtn.style.border = "none";
  addBtn.style.padding = "8px 16px";
  addBtn.style.borderRadius = "8px";
  addBtn.style.cursor = "pointer";
  addBtn.style.marginBottom = "20px";
  addBtn.onclick = () => {
    localStorage.setItem("activeBillIndex", index);
    window.location.href = "select-items.html";
  };




  const ul = document.createElement("ul");
  ul.style.marginTop = "16px";
  ul.style.padding = 0;
  ul.style.listStyle = "none";

  bills[index].items.forEach((item, i) => {



    const li = document.createElement("li");
    li.style.marginBottom = "14px";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";




    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${item.name} x ${item.quantity}`;




    const controls = document.createElement("div");




    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.style.marginLeft = "10px";
    plus.style.backgroundColor = "#4caf50";
    plus.style.color = "white";
    plus.style.border = "none";
    plus.style.padding = "4px 10px";
    plus.style.borderRadius = "8px";
    plus.style.cursor = "pointer";
    plus.onclick = () => {
      item.quantity++;
      saveBills();
      overlay.remove();
      renderBills();
      expandBill(index);
    };




    const minus = document.createElement("button");
    minus.textContent = "×";
    minus.style.marginLeft = "8px";
    minus.style.backgroundColor = "#f44336";
    minus.style.color = "white";
    minus.style.border = "none";
    minus.style.padding = "4px 10px";
    minus.style.borderRadius = "8px";
    minus.style.cursor = "pointer";
    minus.onclick = () => {
      item.quantity--;
      if (item.quantity <= 0) bills[index].items.splice(i, 1);
      saveBills();
      overlay.remove();
      renderBills();
      expandBill(index);
    };

    controls.appendChild(plus);
    controls.appendChild(minus);

    li.appendChild(nameSpan);
    li.appendChild(controls);
    ul.appendChild(li);
  });



  const totalP = document.createElement("p");



  const total = bills[index].items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalP.innerHTML = `<strong>Toplam: ${total.toFixed(2)} TL</strong>`;
  totalP.style.marginTop = "20px";

  box.appendChild(closeBtn);
  box.appendChild(title);
  box.appendChild(addBtn);
  box.appendChild(ul);
  box.appendChild(totalP);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}



function downloadBillAsPDF(index) {



  const bill = bills[index];



  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Deliağa - Adisyon", 20, 20);

  doc.setFontSize(14);
  doc.text(`Müşteri: ${bill.customer}`, 20, 35);




  let y = 50;
  bill.items.forEach(item => {
    doc.text(`${item.name} x ${item.quantity} - ${item.price.toFixed(2)} TL`, 20, y);
    y += 10;
  });




  const total = bill.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  doc.text(`Toplam: ${total.toFixed(2)} TL`, 20, y + 10);

  doc.save(`${bill.customer}-adisyon.pdf`);
}



function saveBills() {
  localStorage.setItem("bills", JSON.stringify(bills));
}

renderBills();