// active-orders.js


let bills = JSON.parse(localStorage.getItem("bills")) || [];


const container = document.getElementById("activeOrdersContainer");

container.style.display = "flex";
container.style.flexWrap = "wrap";
container.style.gap = "20px";



function saveBills() {
  localStorage.setItem("bills", JSON.stringify(bills));
}



function renderOrders() {
  container.innerHTML = "";


  const nonEmptyBills = bills.filter(b => b.items.length > 0);

  if (nonEmptyBills.length === 0) {
    container.innerHTML = "<p style='color: #ccc;'>Aktif sipariş yok.</p>";
    return;
  }

  nonEmptyBills.forEach((bill, billIndex) => {


    const card = document.createElement("div");
    card.className = "bill-card";
    card.style.backgroundColor = "#2c2c2c";
    card.style.borderRadius = "12px";
    card.style.padding = "16px";
    card.style.width = "280px";
    card.style.color = "white";
    card.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
    card.style.maxHeight = "320px";
    card.style.overflowY = "auto";



    const h3 = document.createElement("h3");
    h3.textContent = bill.customer;
    h3.style.marginBottom = "10px";



    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = 0;

    bill.items.forEach((item, itemIndex) => {


      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.marginBottom = "8px";


      const text = document.createElement("span");
      text.textContent = `${item.name} x ${item.quantity}`;



      const delBtn = document.createElement("button");
      delBtn.textContent = "X";
      delBtn.style.backgroundColor = "#f44336";
      delBtn.style.color = "white";
      delBtn.style.border = "none";
      delBtn.style.padding = "2px 6px";
      delBtn.style.borderRadius = "6px";
      delBtn.style.cursor = "pointer";
      delBtn.onclick = () => {
        bill.items.splice(itemIndex, 1);
        if (bill.items.length === 0) {
          bills.splice(bills.indexOf(bill), 1);
        }
        saveBills();
        renderOrders();
      };

      li.appendChild(text);
      li.appendChild(delBtn);
      ul.appendChild(li);
    });

    card.appendChild(h3);
    card.appendChild(ul);
    container.appendChild(card);
  });


}

renderOrders();